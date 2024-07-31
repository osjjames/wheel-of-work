let values = [10, 40, 80, 30, 60, 90, 20, 50]; // Initial values for each segment
let radii = new Array(8); // Radii for each segment
let sliders = new Array(8); // Array of sliders
let inputs = new Array(8); // Array of input boxes
let labels = new Array(8); // Array of label text boxes
let sliceColours = [
  '#0064FF',
  '#14373C',
  '#ff9b00',
  '#9a0023',
  '#737b74',
  '#f9308c',
  '#07661e',
  '#ba00d8',
];

function setup() {
  createCanvas(1080, 800);
  colorMode(HSB, 360, 100, 100);
  let spacing = 60;
  for (let i = 0; i < values.length; i++) {
    // Initialize each slider with color matching its segment
    sliders[i] = new Slider(70, 525 - i * spacing, 180, 10, values[i], color(sliceColours[i]));
    // Initialize each input box to the left of the slider
    inputs[i] = createInput(values[i].toString());
    inputs[i].position(10, 520 - i * spacing);
    inputs[i].size(50);
    inputs[i].input(updateSliderValue(i));
    // Initialize each label box above the slider
    labels[i] = createInput(`Label ${i + 1}`);
    labels[i].position(70, 500 - i * spacing);
    labels[i].size(180);
    labels[i].style('background-color', 'transparent');
    labels[i].style('border', 'none');
    labels[i].style('font-size', '16px');
    labels[i].style('color', sliceColours[i]);
  }
}

function draw() {
  background(255);
  drawWheelOfLife(250);
  drawSliders();
  drawRings(250);
}

function drawRings(maxRadius) {
  strokeWeight(1);
  stroke(0, 0, 0, 0.1); // Black color with 50% opacity
  noFill();
  for (let i = 1; i <= 10; i++) {
    let radius = map(i * 10, 0, 100, 50, maxRadius);
    ellipse(width / 2, height / 2, radius * 2, radius * 2);
  }
}

function drawWheelOfLife(maxRadius) {
  let angleStep = TWO_PI / values.length;
  let currentAngle = 0;
  for (let i = 0; i < values.length; i++) {
    // Use the color from the sliders for each segment
    fill(sliders[i].sliderColor);
    arc(width / 2, height / 2, radii[i] * 2, radii[i] * 2, currentAngle, currentAngle + angleStep, PIE);
    currentAngle += angleStep;
  }
}

function drawSliders() {
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].update();
    sliders[i].display();
    values[i] = int(sliders[i].getValue()); // Explicitly cast float to int
    radii[i] = map(values[i], 0, 100, 50, 250); // Update radii based on slider values
  }
}

class Slider {
  constructor(x, y, w, h, value, sliderColor) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = value;
    this.sliderColor = sliderColor;
    this.dragging = false;
  }

  update() {
    if (this.dragging) {
      this.value = map(mouseX, this.x, this.x + this.w, 0, 100);
      this.value = constrain(this.value, 0, 100);
      this.value = round(this.value / 5) * 5; // Snap to multiples of 5
      inputs[sliders.indexOf(this)].value(int(this.value).toString()); // Update input box value
    }
  }

  display() {
    stroke(0);
    fill(this.sliderColor); // Use HSB color for the slider fill
    rect(this.x, this.y, this.w, this.h);
    fill(this.sliderColor);
    rect(this.x, this.y, map(this.value, 0, 100, 0, this.w), this.h);
    fill(0);
    // text(int(this.value), this.x + this.w + 5, this.y + this.h);
  }

  getValue() {
    return this.value;
  }

  mousePressed() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.dragging = true;
    }
  }

  mouseReleased() {
    this.dragging = false;
  }
}

function mousePressed() {
  for (let slider of sliders) {
    slider.mousePressed();
  }
}

function mouseReleased() {
  for (let slider of sliders) {
    slider.mouseReleased();
  }
}

function updateSliderValue(index) {
  return function() {
    let val = int(this.value());
    val = constrain(val, 0, 100); // Constrain the value between 0 and 100
    val = round(val / 5) * 5; // Snap to multiples of 5
    sliders[index].value = val;
    values[index] = val;
    radii[index] = map(values[index], 0, 100, 50, 250); // Update radii based on input values
  }
}
