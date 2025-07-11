window.addEventListener("load", initializeTargetMuscleGroupsSelect(), false);

// MSAL Config
const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID", // ← Replace with your Azure AD Application (client) ID
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // ← Replace with your Azure AD tenant ID
    redirectUri: window.location.origin
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// Sign In
async function signIn() {
  try {
    const loginResponse = await msalInstance.loginPopup({ scopes: ["User.Read"] });
    document.getElementById("loginStatus").textContent = "Signed in as: " + loginResponse.account.username;
  } catch (error) {
    console.error("Login error:", error);
  }
}

// Sign Out
async function signOut() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    await msalInstance.logoutPopup({ account: accounts[0] });
    document.getElementById("loginStatus").textContent = "Signed out";
  }
}

// Auto-check for logged-in user
window.addEventListener("DOMContentLoaded", () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    document.getElementById("loginStatus").textContent = "Signed in as: " + accounts[0].username;
  }
});

// Section switching
function showSection(id) {

  document
    .querySelectorAll('section')
    .forEach(s => {
      s.classList.remove('active');
    });

  const navButtons = document
    .getElementById('nav-buttons')
    .children;

  [...navButtons].forEach(navButton => {
    navButton
      .classList
      .remove('nav-button-active');
  });

  document
    .getElementById(id)
    .classList
    .add('active');

  event.target.classList.add('nav-button-active');
}

// AI Advice placeholder
function showAIAdvice() {
  document.getElementById('aiResponse').innerHTML = `
    <p>Based on your recent lifts, you should increase your training volume slightly. Deload week is coming soon.</p>
    <p>Predicted 1RM:</p>
    <ul>
      <li>Squat: 425 lbs</li>
      <li>Bench: 285 lbs</li>
      <li>Deadlift: 505 lbs</li>
    </ul>`;
}

function addSet() {

    const clickedButton = event.target;

    const newDiv = document.createElement('div');

    const parentDiv = clickedButton.parentElement;

    numberOfParentDivChildElements = parentDiv
      .children
      .length;

    const numberOfSets = parentDiv.querySelectorAll(".log-workout-sets");

    newDiv.innerHTML = getSetHtml(numberOfSets.length + 1);

    const lastSetElement = parentDiv.children[numberOfParentDivChildElements - 1]; 

    parentDiv.insertBefore(newDiv, lastSetElement);
}

function getSetHtml(setNumber) {
  return `
    <div id="set-${setNumber}" class="log-workout-sets" style="display: table;">
        <h3 class="set-heading">Set ${setNumber} <button class="log-workout-set-note-button">&#128221</button> ${setNumber === 1 ? `` : `<button onclick="deleteSet()" class="delete-button"> X </button>`} </h3>                                                <!-- TODO: Need to dynamically set the number so that it updates when adding more sets -->
          <div class="form-group" style="display: table-row;">
            <label style="display: table-cell; text-align: right;">Weight:</label>
            <input id="weightinput${setNumber}" type="number" step="any" class="log-workout-set-inputs" style="display: table-cell;">            <!-- TODO: Validation that to ensure user input is a number -->
        </div> 
        <div class="form-group" style="display: table-row;">
            <label style="display: table-cell; text-align: right;">Reps:</label>                                   
            <input id="repsinput${setNumber}" type="number" step="1" class="log-workout-set-inputs" style="display: table-cell;">            <!-- TODO: Validation that to ensure user input is a number -->
        </div>   
    </div>`;
}

function getExerciseHtml(exerciseNumber) {
  return `<h2 id="exercise-heading-${exerciseNumber}" class="exercise-heading">Exercise ${exerciseNumber} <button class="log-workout-set-note-button">&#128221</button> ${exerciseNumber === 1 ? `` : `<button onclick="deleteExercise()" class="delete-button"> X </button>`} </h2>
          <div id="logworkoutexercise${exerciseNumber}" class="form-group"> 
            <div style="display: table;">
              <div style="display: table-row;">
                <label for="targetmusclegroupselect${exerciseNumber}" style="display: table-cell; padding-right: 10px;">Target Muscle Group:</label>
                <select id="targetmusclegroupselect${exerciseNumber}" class="log-workout-select" style="display: table-cell;" onchange="handleTargetMuscleGroupSelectionChange()"> </select>  
              </div>
              <div style="display: table-row;">
                <label for="exerciseselect${exerciseNumber}" style="display: table-cell;">Exercise:</label>
                <select disabled id="exerciseselect${exerciseNumber}" class="log-workout-select" style="display: table-cell;"></select>      
              </div>
            </div>
            ${getSetHtml(1)}
            <button class="log-workout-buttons" onclick="addSet()">Add Set </button>`;
}

function deleteExercise() {

    const clickedButton = event.target;

    const parentElement = clickedButton.parentElement;

    const grandParentElement = parentElement.parentElement;

    const greatGrandParentElement = grandParentElement.parentElement;

    greatGrandParentElement.removeChild(grandParentElement);

    const exerciseHeadings = 
      [...document.querySelectorAll('[id*="exercise-heading-"]')];

      let numberOfExercises = 1;

      exerciseHeadings.forEach(heading => {
        
        heading.innerHTML = `Exercise ${numberOfExercises} <button class="log-workout-set-note-button">&#128221</button> <button onclick="deleteExercise()" class="delete-button"> X </button>`;

        numberOfExercises++;
      });

}

function deleteSet() {

    const clickedButton = event.target;

    const parentElement = clickedButton.parentElement;

    const grandParentElement = parentElement.parentElement;

    const greatGrandParentElement = grandParentElement.parentElement;

    greatGrandParentElement.removeChild(grandParentElement);

    const setHeadings = [...greatGrandParentElement.parentElement.querySelectorAll('.set-heading')];

    let numberOfSets = 1;

      setHeadings.forEach(heading => {

        if (numberOfSets === 1) {
          heading.innerHTML = `Set ${numberOfSets} <button class="log-workout-set-note-button">&#128221</button>`
        }
        else {
          heading.innerHTML = `Set ${numberOfSets} <button class="log-workout-set-note-button">&#128221</button> <button onclick="deleteSet()" class="delete-button"> X </button>`

        }

        numberOfSets++;
      });
}

function addExercise() {

    const numberOfExercises = document.querySelectorAll('[id*="exerciseselect"]').length;

    const newNumberOfExercises = numberOfExercises + 1;

    const logworkoutexercisesDiv = document.getElementById("logworkoutexercises");

    const newDiv = document.createElement('div');

    newDiv.classList.add("log-workout-exercise");

    newDiv.innerHTML = getExerciseHtml(newNumberOfExercises);

    const targetMuscleGroupsSelect = newDiv.querySelector(`[id="targetmusclegroupselect${newNumberOfExercises}"]`)

    populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect);

    logworkoutexercisesDiv.appendChild(newDiv);
}

function saveWorkout() {

    const userInputs = getLogWorkoutUserInput();

    validateLogWorkoutUserInput(userInputs);
    
    // TODO: Send to server

    // TODO: If successful response, display message and reset page 
    showToast("Workout saved!");

    resetLogWorkout();
    
    // TODO: Else, display error message
    showErrorToast("Save unsuccessful");
}

function getLogWorkoutUserInput() {

  const userInputs = {
      name: document.getElementById('logworkoutnameinput').value,
      date: document.getElementById('logworkoutdateinput').value,
      startTime: document.getElementById('logworkoutstarttimeinput').value,
      endTime: document.getElementById('logworkoutendtimeinput').value,
      notes: document.getElementById('logworkoutnotesinput').value,
      exercises: []
    }

    const exercises = document.querySelectorAll('[id*="logworkoutexercise"]'); 

      [...exercises].forEach((exercise, index) => {

      if (index === 0) {
        return;
      }

      const exerciseToAdd = {
          targetMuscleGroup: exercise.querySelector('[id*="targetmusclegroupselect"]').value,
          exercise: exercise.querySelector('[id*="exerciseselect"]').value,
          sets: []
        };


      const sets = exercise.querySelectorAll('[id*="set-"]'); 

      [...sets].forEach(set => {

        const reps = set.querySelector('[id*="repsinput"]').value;

        const weight = set.querySelector('[id*="weightinput"]').value;

        exerciseToAdd.sets.push({
          reps,
          weight
        });
      });

      userInputs.exercises.push(exerciseToAdd);
    });

    return userInputs;
}

function validateLogWorkoutUserInput(userInputs) {

  // TODO: Null checks

  // TODO: If name is null, assign it a default

  // TODO: Start time should not exceed end time
}

function getTargetMuscleGroups() {
  return [
            { id: '', name: 'Chest' },
            { id: '', name: 'Back' },
            { id: '', name: 'Quads' },
            { id: '', name: 'Hamstrings' }
          ]
          .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
}

function initializeTargetMuscleGroupsSelect() {

    const targetMuscleGroupsSelect = document.getElementById("targetmusclegroupselect1");

    populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect);
}

function populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect) {

  targetMuscleGroupsSelect.innerHTML = '';

    const targetMuscleGroups = getTargetMuscleGroups();

    [{id: '', name: ''}, ...targetMuscleGroups].forEach(targetMuscleGroup => {
      const option = document.createElement("option");
      option.value = JSON.stringify(targetMuscleGroup);
      option.textContent = targetMuscleGroup.name;
      targetMuscleGroupsSelect.appendChild(option); 
    });
}

function handleTargetMuscleGroupSelectionChange() {

  const clickedSelect = event.target;

  const parentElement = clickedSelect.parentElement;

  const grandParentElement = parentElement.parentElement;

  const exerciseSelect = grandParentElement.querySelector('[id*="exerciseselect"]');

  const targetMuscleGroups = getTargetMuscleGroups(); // TODO: Need to store these somewhere

  exerciseSelect.innerHTML = '';

  if (clickedSelect.value.name === '' || !targetMuscleGroups.map(targetMuscleGroup => targetMuscleGroup.name).includes(JSON.parse(clickedSelect.value).name)) {

    exerciseSelect.disabled = true;

    return;
  }

  const exercises = getExercises(JSON.parse(clickedSelect.value).name); // TODO: Change this to id

  // TODO: Populate the exercise select with values
    ['', ...exercises].forEach(exercise => {
      const option = document.createElement("option");
      option.value = JSON.stringify(exercise);
      option.textContent = exercise.name;
      exerciseSelect.appendChild(option); 
    });

  exerciseSelect.disabled = false;
}

function getExercises(targetMuscleGroup) {

  // TODO: Send target muscle group to server

  // TODO: Return results

  if (targetMuscleGroup === 'Chest'){
    return [
        {id: '', name: 'Barbell Bench Press'},
        {id: '', name: 'Dumbbell Bench Press'},
        {id: '', name: 'Machine Chest Press'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroup === 'Back'){
    return [
        {id: '', name: 'Lat Pulldown'},
        {id: '', name: 'Cable Rows'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroup === 'Quads'){
    return [
        {id: '', name: 'Leg Extensions'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroup === 'Hamstrings'){
    return [
        {id: '', name: 'Leg Curls'},
        {id: '', name: 'RDLs'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  return [];
}

function getUserSettings(userId) {

  // TODO: Make request with userId

  return {
    id: '',
    userId: '',
    preferredUnitsOfMeasure: {
      id: '',
      name: 'lbs'
    },
    emailNotificationsOn: true,
    preferredEmailTone: {
      id: '',
      tone: 'Motivational'
    }
  }; // TODO: Mocked for now
}

function getUserBodyWeightLogs() {
  return [
    {id: '', date: new Date('2025-07-02'), weight: 187.6}, 
    {id: '', date: new Date('2025-07-01'), weight: 186.8}
  ]
  .sort((a, b) => b.date - a.date); // TODO: Mocked for now
}

// Chart.js example
const ctx = document.getElementById('performanceChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Squat Progress',
      data: [315, 325, 335, 345],
      borderColor: 'green',
      fill: false
    }]
  }
});

function showToast(message = "Save successful") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function showErrorToast(message = "Save unsuccessful") {
  const toast = document.getElementById("error-toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function resetLogWorkout() {

  document.getElementById('logworkoutnameinput').value = '';

  document.getElementById('logworkoutdateinput').value = '';

  document.getElementById('logworkoutstarttimeinput').value = '';

  document.getElementById('logworkoutendtimeinput').value = '';

  document.getElementById('logworkoutnotesinput').value = '';

  var logworkoutexercises = document.getElementById('logworkoutexercises');

  logworkoutexercises.innerHTML = '';

  const newDiv = document.createElement('div');

  newDiv.classList.add('log-workout-exercise');

  newDiv.id = 'exercise1';

  newDiv.innerHTML = getExerciseHtml(1); 

  logworkoutexercises.innerHTML = newDiv.outerHTML;
}

function handleResetButtonClick() {
  showConfirmDialog();
}

function showConfirmDialog(callback) {
  document.getElementById("confirmDialog").style.display = "flex";
}

function handleResetNoButtonClick() {
  document.getElementById("confirmDialog").style.removeProperty("display");
}

function handleResetYesButtonClick() {

  resetLogWorkout();

  document.getElementById("confirmDialog").style.removeProperty("display");
}