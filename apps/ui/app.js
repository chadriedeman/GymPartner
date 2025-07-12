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

  // TODO: If selected section === currently selected section, return

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

  if (id === "history") {
    loadWorkoutHistory();
  }
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
          targetMuscleGroupId: JSON.parse(exercise.querySelector('[id*="targetmusclegroupselect"]').value).id,
          exerciseId: JSON.parse(exercise.querySelector('[id*="exerciseselect"]').value).id,
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
            { id: 'test target muscle group id 1', name: 'Chest' },
            { id: 'test target muscle group id 2', name: 'Back' },
            { id: 'test target muscle group id 3', name: 'Quads' },
            { id: 'test target muscle group id 4', name: 'Hamstrings' }
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
        {id: 'test chest id 1', name: 'Barbell Bench Press'},
        {id: 'test chest id 2', name: 'Dumbbell Bench Press'},
        {id: 'test chest id 3', name: 'Machine Chest Press'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroup === 'Back'){
    return [
        {id: 'test back id 1', name: 'Lat Pulldown'},
        {id: 'test back id 2', name: 'Cable Rows'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroup === 'Quads'){
    return [
        {id: 'test quads id 1', name: 'Leg Extensions'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroup === 'Hamstrings'){
    return [
        {id: 'test hamstrings id 1', name: 'Leg Curls'},
        {id: 'test hamstrings id 2', name: 'RDLs'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  return [];
}

function getUserSettings(userId) {

  // TODO: Make request with userId

  return {
    id: 'test user settings id 1',
    userId: 'test user id 1',
    preferredUnitsOfMeasure: {
      id: 'test preferred uom id 1',
      name: 'lbs'
    },
    emailNotificationsOn: true,
    preferredEmailTone: {
      id: 'test preferred email tone id 1',
      tone: 'Motivational'
    }
  }; // TODO: Mocked for now
}

function getUserBodyWeightLogs() {
  return [
    {id: 'test body weight id 1', date: new Date('2025-07-02'), weight: 187.6}, 
    {id: 'test body weight id 2', date: new Date('2025-07-01'), weight: 186.8}
  ]
  .sort((a, b) => b.date - a.date); // TODO: Mocked for now
}

function loadWorkoutHistory() {

  const workouts = getWorkouts('');

  const workoutHistoryDiv = document.getElementById('workout-history-div');

  workoutHistoryDiv.innerHTML = "";

  [...workouts].forEach(workout => {

    const newDiv = document.createElement('div');

    newDiv.classList.add('workout-history-exercise');

    newDiv.innerHTML =
        `<div class="workout-history-exercise-date">
          ${workout.date.toISOString().split('T')[0]} 
        </div>
        <div class="workout-history-exercise-name">
          ${workout.name} 
        </div>
        <div>
          <button class="individual-workout-details-button" onclick="handleGetIndividualWorkoutHistoryClick()" value="${workout.id}">Details</button>
          <button class="workout-history-delete-button" onclick="handleDeleteIndividualWorkoutHistoryClick()" value="${workout.id}"> X </button>
        </div>`;

      workoutHistoryDiv.appendChild(newDiv);
  });
}

function handleGetIndividualWorkoutHistoryClick() {

  var workoutId = event.target.value;

  var workoutDetails = getIndividualWorkout(workoutId);

  loadIndividualWorkoutHistoryPage(workoutDetails);
}

function getIndividualWorkout(workoutId) {
  
  // TODO: Send workoutId to server with request

  const mockedWorkoutDetails = 
  {
    name: "Test workout name 1",
    date: new Date("2025-07-09"),
    startTime: "09:52", // TODO: Time object
    endTime: "11:18", // TODO: Time object
    notes: "  These are test notes",
    exercises: [
        {
            targetMuscleGroup: {
              id: "test target muscle group id 1",
              name: "test muscle group name"
            }, 
            exercise: {
              id: "test chest id 1",
              name: "test exercise name 1",
              testMuscleGroupId: 'test target muscle group id 1'
            },
            sets: [
                {
                    "reps": 5,
                    "weight": 225
                }
            ]
        }
    ]
  };

  return mockedWorkoutDetails; // TODO: Mocked
}

function loadIndividualWorkoutHistoryPage(workoutDetails) {

  var workoutHistoryDiv = document.getElementById('workout-history-div');

  workoutHistoryDiv.innerHTML = ""; // TODO: Could change to display: hidden

  const individualWorkoutHistoryHtml = getIndividualWorkoutHistoryHtml(workoutDetails);

  workoutHistoryDiv.innerHTML = individualWorkoutHistoryHtml;
}

function getIndividualWorkoutHistoryHtml(workoutDetails) {

  const div = document.createElement('div');

  div.classList.add('log-workout-exercises');

  // TODO: Add date, name, etc.

  div.innerHTML = getIndividualWorkoutHeaderInformationHtml(workoutDetails.name, workoutDetails.date, workoutDetails.startTime, workoutDetails.endTime, workoutDetails.notes);

  [...workoutDetails.exercises].forEach(exercise => {
    // TODO: Add html
  });

  return div.outerHTML;
}

function getIndividualWorkoutHeaderInformationHtml(name, date, startTime, endTime, notes) {
  return `
    <div class="log-workout-header-group">
      <div class="log-new-workout-date-group">
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell; padding-right: 55px;">Name:</label>
                <input type="text" class="log-workout-inputs" value="${name}" style="display: table-cell;">                                     
            </div>
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell; padding-right: 55px;">Date:</label>
                <input type="date" class="log-workout-inputs" value="${date}" style="display: table-cell;">                                     
            </div>
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell;">Start Time:</label>
                <input type="time" class="log-workout-inputs" value="${startTime}" style="display: table-cell;">                                     
            </div>
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell;">End Time:</label>
                <input" type="time" class="log-workout-inputs" value="${endTime}" style="display: table-cell;"> 
            </div>
        </div>
        <div class="log-workout-notes-div">
          <label>Workout Notes:</label>
          <textarea type="text" value="${notes}" class="log-workout-notes-textarea"></textarea>                                   
        </div>
    </div>`;
}

function handleDeleteIndividualWorkoutHistoryClick() {
  var workoutId = event.target.value;

  // TODO: Show confirmation dialog. Reuse one that was built for reset.
}

function deleteIndividualWorkout(workoutId) {

}

function getWorkouts(userId) {

  // TODO: Send request to server

  return [
    {
      id: 'test workout id 1',
      name: 'test workout name 1',
      date: new Date('2025-07-01')
    },
    {
      id: 'test workout id 2',
      name: 'test workout name 2',
      date: new Date('2025-06-30')
    },
    {
      id: 'test workout id 3',
      name: 'test workout name 3',
      date: new Date('2025-06-27')
    },
    {
      id: 'test workout id 4',
      name: 'test workout name 4',
      date: new Date('2025-06-26')
    },
    {
      id: 'test workout id 5',
      name: 'test workout name 5',
      date: new Date('2025-06-25')
    }
  ];
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

  const targetMuscleGroupsSelect = newDiv.querySelector(`[id="targetmusclegroupselect1"]`)

  populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect);

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