#include <tapcode5.0_inference.h>
#include <Arduino_LSM9DS1.h>
#include <ArduinoBLE.h>

const int IN3 = 5;
const int IN4 = 4;
const int ENB = 3;
const int button1 = 6;
const int button2 = 8;
int debugMode = 0;
int PWM = 150;
int lockTime = 4500;
int lockTimeCal = 400;

static bool debug_nn = false; // Set this to true to see e.g. features generated from the raw signal

float x, y, z, a, a_last, da;
int knock,sum,reading;
int i = 0;
unsigned long diffArr[5];

static unsigned long last_interval_ms = 0;
static unsigned long last_interval2 = 0;
static unsigned long last_knock = 0;
static unsigned long diff = 0;
int countToLock = 0;

/* Constant defines -------------------------------------------------------- */

#define interval2           120
#define CONVERT_G_TO_MS2    9.80665f

/* Private variables ------------------------------------------------------- */

// BLE Battery Service
BLEService predictionService("180F");
BLEByteCharacteristic switchCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEUnsignedCharCharacteristic LockStatusBLE("2A18",  // standard 16-bit characteristic UUID
     BLERead | BLENotify); // remote clients will be able to get notifications if this characteristic changes

int oldBatteryLevel = 0;  // last battery level reading from analog input
long previousMillis = 0;  // last time the battery level was checked, in ms
int encodedPrediction = 0; 

bool lockState = 1;

float features[] = {1, 1, 1, 1};

 
int raw_feature_get_data(size_t offset, size_t length, float *out_ptr) {
    memcpy(out_ptr, features + offset, length * sizeof(float));
    return 0;
}

void setup()
{   
    Serial.begin(115200);
    //while (!Serial);
    Serial.println("Edge Impulse Inferencing Demo");

    //configure I/O
    pinMode(22, OUTPUT);
    pinMode(23, OUTPUT);
    pinMode(24, OUTPUT);
    pinMode(25, OUTPUT);
    
    digitalWrite(22, HIGH);
    digitalWrite(23, HIGH);
    digitalWrite(24, LOW);

    pinMode (IN3, OUTPUT);
    pinMode (IN4, OUTPUT);
    pinMode (ENB, OUTPUT);
    pinMode (ENB, OUTPUT);
 
    pinMode (13, OUTPUT);

    pinMode(button1,INPUT_PULLUP);
    pinMode(button2,INPUT_PULLUP);
   
    delay(100);
  
    Serial.print("button1");
    Serial.println(digitalRead(button1));
  
    Serial.print("button2");
    Serial.println(digitalRead(button2));

    //start manual controll mode if button is pressed during setup
    if ((digitalRead(button1) == 0) || (digitalRead(button2) == 0)){
      debugMode = 1;
      Serial.println("debug mode");
      debugLight();
      delay(800);
      
      while(1){
        
          if ( digitalRead(button1) == 0){
              green();
              analogWrite(ENB, 150);
              digitalWrite(IN3, LOW);
              digitalWrite(IN4, HIGH);
              Serial.println("..locking..");
              delay(300);
              analogWrite(ENB, 0);
              Serial.println("open");
              
              }
          
          if (digitalRead(button2) == 0){
              red();
              analogWrite(ENB, 150);
              digitalWrite(IN3, HIGH);
              digitalWrite(IN4, LOW);
              Serial.println("..unlocking..");
              delay(300);
              analogWrite(ENB, 0);
              Serial.println("close");
               
            }
        }
  } 

  if (!IMU.begin()) {
        ei_printf("Failed to initialize IMU!\r\n");
  }
  else {
        ei_printf("IMU initialized\r\n");
  }
  // begin initialization
  
  if (!BLE.begin()) {
      Serial.println("starting BLE failed!");
  
      while (1);
  }

  BLE.setLocalName("taplock");
  BLE.setAdvertisedService(predictionService); // add the service UUID
  
  predictionService.addCharacteristic(LockStatusBLE); // add the battery level characteristic
  LockStatusBLE.writeValue(1); // set initial value for this characteristic
  
  predictionService.addCharacteristic(switchCharacteristic);

  BLE.addService(predictionService); // Add the battery service

  switchCharacteristic.writeValue(0);
  BLE.advertise();
  
  Serial.println("Bluetooth device active, waiting for connections...");

}

void loop(){
  
    static unsigned long last_interval_ms = 0;
    static unsigned long last_interval2 = 0;
    static unsigned long last_knock = 0;
    static unsigned long diff = 0;
    
    //turn on blue light
    digitalWrite(22, HIGH);
    digitalWrite(23, HIGH);
    digitalWrite(24, LOW);
    
    // wait for a BLE central
    BLEDevice central = BLE.central();   
    
    
    // if a central is connected to the peripheral:
    //central
    if (central) {
      Serial.print("Connected to central: ");
      // print the central's BT address:
      Serial.println(central.address());
      digitalWrite(LED_BUILTIN, HIGH);
      digitalWrite(22, LOW);
      digitalWrite(23, LOW);
      digitalWrite(24, LOW);

      
    while (central.connected()) {   
      
      //turn on white light
      digitalWrite(22, LOW);
      digitalWrite(23, LOW);
      digitalWrite(24, LOW);

      getTaps();
     
     if (switchCharacteristic.written()) {
     
        if ((switchCharacteristic.value()==48)) {   // any value other than 0
          Serial.println("locking");
          lock(PWM,lockTime-lockTimeCal);         // will turn the LED on
        } 
        if((switchCharacteristic.value()==49)){                              // a 0 value
          Serial.println(("unclocking:"));
          unlock(PWM,lockTime);          // will turn the LED off
        }
        //broadcast lockstate value
        LockStatusBLE.writeValue(lockState);        
      }

     //if button is pressed, lock the lock
     if ((digitalRead(button1) == 0) || (digitalRead(button2) == 0)){
      lock(PWM,lockTime-lockTimeCal);
     }
      
     countToLock++;
     //auto lock after 20-30s
     if(countToLock > 100000){

      countToLock = 0;
      Serial.println("locking");
      checkLock();
      } 
    }

  //when discon turn on blue light
  Serial.println("discon");
  Serial.println(central.address());
  digitalWrite(22, HIGH);
  digitalWrite(23, HIGH);
  digitalWrite(24, LOW);
  countToLock = 0;
  
}

  //in case ble not connected, read sensors 
  getTaps();

  //lock the lock if button is pressed
  if ((digitalRead(button1) == 0) || (digitalRead(button2) == 0)){
        lock(PWM,lockTime-lockTimeCal);
      }

  countToLock++;
  //after some amount of time auto lock
  if(countToLock > 100000){

    countToLock = 0;
    Serial.println("locking");
    checkLock();
  }

}
 
void ei_printf(const char *format, ...) {
    static char print_buf[1024] = { 0 };

    va_list args;
    va_start(args, format);
    int r = vsnprintf(print_buf, sizeof(print_buf), format, args);
    va_end(args);

    if (r > 0) {
        Serial.write(print_buf);
    }
}

void classify(){
    // when the central 
    ei_printf("Edge Impulse standalone inferencing (Arduino)\n");
    if (sizeof(features) / sizeof(float) != EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) {
        ei_printf("The size of your 'features' array is not correct. Expected %lu items, but had %lu\n",
            EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, sizeof(features) / sizeof(float));
        delay(1000);
        return;
    }
    
    ei_impulse_result_t result = { 0 };

    // the features are stored into flash, and we don't want to load everything into RAM
    signal_t features_signal;
    features_signal.total_length = sizeof(features) / sizeof(features[0]);
    features_signal.get_data = &raw_feature_get_data;

    // invoke the impulse
    EI_IMPULSE_ERROR res = run_classifier(&features_signal, &result, true /* debug */);
    ei_printf("run_classifier returned: %d\n", res);

    if (res != 0) return;
    // print the predictions
    ei_printf("Predictions ");

    float maxVal = 0;
    int match = 5;
   
    //ei_printf("Classification: %d ms",result.timing.classification);
    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
    ei_printf("%.5f", result.classification[ix].value);
    
    if (result.classification[ix].value > maxVal && result.classification[ix].value > .79){
      maxVal = result.classification[ix].value;
      match = ix;
     }
    }
    
    Serial.println(" ");
    Serial.print("match:");
    Serial.print(match);
    Serial.print(" percent:");
    Serial.println(maxVal);
  
    if((match == 0) && (lockState == 1)){
      unlock(PWM,lockTime);
    }
    else if(lockState == 0){
       Serial.print("is unlocked!");
       errBlinkUnlocked();
     }else{
       Serial.println("wrong tap! ");
       errBlinkWrong();
      }
    LockStatusBLE.writeValue(lockState);
    //batteryLevelChar.writeValue(lockState);

  }

void getTaps(){

  float x, y, z, a;
  last_interval_ms = millis();
  IMU.readAcceleration(x, y, z);
  a = ((x+y+z)/3)*100*5;
  da = a - a_last;  
  //abs(da) > 7 play around to make lock more sensitive
  if(abs(da) > 7 && (millis() > last_interval2 + interval2)){
    
    diff = millis()-last_interval2;
    //if more that 2 seconds have passed reset tap counter to 0
    if(diff > 2000){
        i = 0;
        diff = 0;
    }

    last_interval2 = millis();
    // UNCOMMMENT FOR ****** DEBUG ****
    //has to be commented while recording
    Serial.print("DEBUG dt: ");
    Serial.println(diff);
    
    diffArr[i]=diff;

    if (i >= 4){
      i = 0;
      sum = diffArr[1]+diffArr[2]+diffArr[3]+diffArr[4];
      if(diffArr[0] == 0 && sum > 1000){
        
        for(int n=1; n <= 4; n++){

            features[n-1] = diffArr[n];
            Serial.println(features[n-1]);
            
          if(n <=3 && n != 0){
            Serial.print(",");
          }
          if(n == 4){
             classify();
             Serial.println("classifying....");
            }
          
        }

       }else{
        
        Serial.println("ERR");
        errBlinkWrong();
       
        }

    }else{
     i++;  
    }
    
  }

  a_last = a;
  knock = 0;

}

void lock(int PWM, int Delay){

    if (lockState == 0){
    lockState = 1;
    green();
    analogWrite(ENB, PWM);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
    Serial.println("..locking..");
    delay(Delay);
    analogWrite(ENB, 0);
    }else{
      Serial.println("not locking already locked");
      errBlinkUnlocked();
    }
    LockStatusBLE.writeValue(lockState);

  }



void unlock(int PWM,int Delay){

    if(lockState == 1){
      countToLock = 0;
      lockState = 0;
      red();
      analogWrite(ENB, PWM);
      digitalWrite(IN3, HIGH);
      digitalWrite(IN4, LOW);
      Serial.println("..unlocking..");
      delay(Delay);
      analogWrite(ENB, 0);
    }else{
      Serial.println("not unlocking already unlocked");
      errBlinkUnlocked();
    }
    LockStatusBLE.writeValue(lockState);

  }

void errBlinkWrong(){

  for (int c = 0;c<5;c++){
    digitalWrite(22, LOW);
    digitalWrite(23, HIGH);
    digitalWrite(24, HIGH);
  
    delay(80);
  
    digitalWrite(22, HIGH);
    digitalWrite(23, HIGH);
    digitalWrite(24, HIGH);
  
    delay(80);
    }
  }

void errBlinkUnlocked(){
  for (int c = 0;c<5;c++){
    digitalWrite(22, HIGH);
    digitalWrite(23, LOW);
    digitalWrite(24, HIGH);
  
    delay(80);
  
    digitalWrite(22, HIGH);
    digitalWrite(23, HIGH);
    digitalWrite(24, HIGH);
  
    delay(80);
    }
  }

void errBlinkRiding(){
  for (int c = 0;c<4;c++){
    digitalWrite(22, HIGH);
    digitalWrite(23, LOW);
    digitalWrite(24, LOW);
  
    delay(50);
  
    digitalWrite(22, HIGH);
    digitalWrite(23, HIGH);
    digitalWrite(24, HIGH);
  
    delay(50);
    }
  }
  


void red(){
  digitalWrite(22, LOW);
  digitalWrite(23, HIGH);
  digitalWrite(24, HIGH);

  }

void green(){
  digitalWrite(22, HIGH);
  digitalWrite(23, LOW);
  digitalWrite(24, HIGH);
}

void debugLight(){
  digitalWrite(22, LOW);
  digitalWrite(23, LOW);
  digitalWrite(24, HIGH);
  }

void checkLock(){
  //locks only if stationary
  IMU.readAcceleration(x, y, z);
  int a = int(((x+y+z)/3)*100*5);
  int last_a = a;
  int diff_a = 0;
  for(int c=0;c<5;c++){
    IMU.readAcceleration(x, y, z);
    a = int(((x+y+z)/3)*100*5);
    Serial.println(int(a));
    diff_a = abs((abs((last_a - a)) - diff_a));
    
  }

  if (diff_a == 0){
    Serial.println("locking, no driving detected!");
    lock(PWM,lockTime-lockTimeCal);
  }else{
    Serial.println("not locking detected riding!");
    errBlinkRiding();
    }
  
  }
  
  
