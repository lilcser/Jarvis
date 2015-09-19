/*
 * a : 300 left
 * b: 300 right
 * c: 
 * d:  
 * e: left - uturn
 * f: message received
 * 
 * 
 * 
 * 
 * 
 * 
 */






char val; // variable to receive data from the serial port

int set1pin = 3;
int set2pin = 11; 
int set3pin = 10;
int set4pin = 5;

int fadeAmount = 20;
int brightness = 0;
int blinkCount = 0;
bool fadeUp = true;
bool ledSets[4] = {false, false, false, false};

void setup() {
  pinMode(set1pin, OUTPUT);
  pinMode(set2pin, OUTPUT);
  pinMode(set3pin, OUTPUT);
  pinMode(set4pin, OUTPUT);
  Serial.begin(9600);       // start serial communication at 9600bps
}


void loop() {
  if( Serial.available() )       // if data is available to read
  {
    val = Serial.read();         // read it and store it in 'val'
    Serial.println(val);
  }
  if( val == 'a' ){
      ledSets[0] = true;
      ledSets[1] = true;
      ledBlink(ledSets, 4, 25);
  } 
  if( val == 'b' ){
      ledSets[2] = true;
      ledSets[3] = true;
      ledBlink(ledSets, 4, 25);
  }
  if( val == 'c' ){
      ledSets[0] = true;
      ledSets[1] = true;
      ledBlink(ledSets, 5, 15);
  } 
  if( val == 'd' ){
      ledSets[2] = true;
      ledSets[3] = true;
      ledBlink(ledSets, 5, 15);
  }
  if( val == 'e' ){
    blinkOnce(set1pin, 20);
    blinkOnce(set2pin, 20);
    blinkOnce(set3pin, 20);
    blinkOnce(set4pin, 20);
    blinkOnce(set1pin, 20);
    blinkOnce(set2pin, 20);
    blinkOnce(set3pin, 20);
    blinkOnce(set4pin, 20);
    resetLed();
  }
  if( val == 'f' ){
    ledSets[0] = true;
    ledSets[1] = true;
    ledSets[2] = true;
    ledSets[3] = true;
    ledBlink(ledSets, 3, 50);
  }
}

void ledBlink(bool set[], int totalBlinks, int blinkSpeed){
  while (blinkCount < totalBlinks){
  if (fadeUp == true){
    brightness = brightness + fadeAmount;
  }else{
    brightness = brightness - fadeAmount;
  }
  if (brightness >=255) {
    brightness = 255;
    fadeUp = false;
  }
  if (brightness <= 0) {
    blinkCount++;
    brightness = 0;
    fadeUp = true;
  }
  delay(blinkSpeed);
  
  if (set[0] == true){
      analogWrite(3, brightness);
  }
  if (set[1] == true){
    analogWrite(11, brightness);
  }
  if (set[2] == true){
    analogWrite(10, brightness);
    
  }
  if (set[3] == true){
    analogWrite(5, brightness);
  }
  }
  blinkCount = 0;
  val = 'z';
  resetLed();
}

void blinkOnce(int pin, int blinkSpeed){
  bool active = true;
  bool intensityIncrease = true;
  while(active == true){
      if (intensityIncrease == true){
        brightness = brightness + fadeAmount;
      }else{
        brightness = brightness - fadeAmount;
      }
      if (brightness >=255) {
        brightness = 255;
        intensityIncrease = false;
      }
      if (brightness <= 0) {
        blinkCount++;
        brightness = 0;
        active = false;
      }
      delay(blinkSpeed);
      analogWrite(pin, brightness);
  } 
  val = 'z';
  blinkCount = 0;
  resetLed();
}

void resetLed(){
  ledSets[0] = false;
  ledSets[1] = false;
  ledSets[2] = false;
  ledSets[3] = false;
}

