window.addEventListener("load", initializeTargetMuscleGroupsSelect, false);

let currentWorkoutHistoryDivHtml = "";

let currentlySelectedSection = "";

const stateManager = {
  userId: null,
  currentWorkoutHistoryDivHtml: "",
  currentlySelectedSection: "",
  targetMuscleGroups: null
}

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

  if (currentlySelectedSection === id) {
    return;
  }

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

  currentlySelectedSection = id;

}

function addSet() {

    const clickedButton = event.target;

    const newDiv = document.createElement('div');

    const parentDiv = clickedButton.parentElement;

    numberOfParentDivChildElements = parentDiv
      .children
      .length;

    const numberOfSets = parentDiv.querySelectorAll(".workout-sets");

    newDiv.innerHTML = getSetHtml(numberOfSets.length + 1);

    const lastSetElement = parentDiv.children[numberOfParentDivChildElements - 1]; 

    parentDiv.insertBefore(newDiv, lastSetElement);
}

function getSetHtml(setNumber) {
  return `
    <div id="set-${setNumber}" class="workout-sets" style="display: table;">
        <h3 class="set-heading">Set ${setNumber} <button class="workout-set-note-button">&#128221</button> ${setNumber === 1 ? `` : `<button onclick="deleteSet()" class="delete-button"> X </button>`} </h3>
          <div class="form-group" style="display: table-row;">
            <label style="display: table-cell; text-align: right;">Weight:</label>
            <input id="weight-input-${setNumber}" type="number" step="any" class="log-workout-set-inputs" style="display: table-cell;">            <!-- TODO: Validation that to ensure user input is a number -->
        </div> 
        <div class="form-group" style="display: table-row;">
            <label style="display: table-cell; text-align: right;">Reps:</label>                                   
            <input id="reps-input-${setNumber}" type="number" step="1" class="log-workout-set-inputs" style="display: table-cell;">            <!-- TODO: Validation that to ensure user input is a number -->
        </div>   
    </div>`;
}

function getExerciseHtml(exerciseNumber) {
  return `<h2 id="exercise-heading-${exerciseNumber}" class="exercise-heading">Exercise ${exerciseNumber} </h2>
          <div id="log-workout-exercise-${exerciseNumber}" class="form-group"> 
            <div style="display: table;">
              <div style="display: table-row;">
                <label for="target-muscle-group-select-${exerciseNumber}" style="display: table-cell; padding-right: 10px;">Target Muscle Group:</label>
                <select id="target-muscle-group-select-${exerciseNumber}" class="log-workout-select" style="display: table-cell;" onchange="handleTargetMuscleGroupSelectionChange()"> </select>  
              </div>
              <div style="display: table-row;">
                <label for="exercise-select-${exerciseNumber}" style="display: table-cell;">Exercise:</label>
                <select disabled id="exercise-select-${exerciseNumber}" class="log-workout-select" style="display: table-cell;"></select>      
              </div>
            </div>
            ${getSetHtml(1)}
            <button class="log-workout-buttons" onclick="addSet()">Add Set </button> 
          </div>
          <button class="log-workout-buttons">Add Note &#128221</button> ${exerciseNumber === 1 ? `` : `<button onclick="deleteExercise()" class="delete-button"> [X] Delete </button>`}`;
}

function deleteExercise() {

    const clickedButton = event.target;

    const parentElement = clickedButton.parentElement;

    const grandParentElement = parentElement.parentElement;

    const greatGrandParentElement = grandParentElement.parentElement;

    greatGrandParentElement.removeChild(grandParentElement);

    const exerciseHeadings = 
      [...greatGrandParentElement.querySelectorAll('[id*="exercise-heading-"]')];

      let numberOfExercises = 1;

      exerciseHeadings.forEach(heading => {
        
        heading.innerHTML = `Exercise ${numberOfExercises} <button class="workout-set-note-button">&#128221</button> ${numberOfExercises === 1 ? '' : '<button onclick="deleteExercise()" class="delete-button"> X </button>'}`;

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
          heading.innerHTML = `Set ${numberOfSets} <button class="workout-set-note-button">&#128221</button>`
        }
        else {
          heading.innerHTML = `Set ${numberOfSets} <button class="workout-set-note-button">&#128221</button> <button onclick="deleteSet()" class="delete-button"> X </button>`

        }

        numberOfSets++;
      });
}

function addExercise(section) {

    let element = "";

    if (section === "logworkout") {

      element = event.target
        .parentElement;
    }

    if (section === "history") {

      element = event.target
        .parentElement
        .parentElement;
    }

    const numberOfExercises = element.querySelectorAll('[id*="exercise-select"]').length;

    const newNumberOfExercises = numberOfExercises + 1;

    const workoutexercisesDiv = element.querySelector('[id*="workout-exercises"]');

    const newDiv = document.createElement('div');

    newDiv.classList.add("log-workout-exercise");

    newDiv.innerHTML = getExerciseHtml(newNumberOfExercises);

    const targetMuscleGroupsSelect = newDiv.querySelector(`[id="target-muscle-group-select-${newNumberOfExercises}"]`)

    populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect);

    workoutexercisesDiv.appendChild(newDiv);
}

function saveWorkout() {

    const userInputs = getLogWorkoutUserInput();

    var validateLogWorkoutUserInputResult = validateLogWorkoutUserInput(userInputs);

    if (!validateLogWorkoutUserInputResult.isValidLogWorkoutUserInput) {

      // TODO: Indicate to the user what is wrong with the input

      return;
    }
    
    fetch('https://your-server.com/api/workouts', { // TODO: Update url. Needs to be pulled from appsettings
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInputs)
    })
    .then(response => {
      if (response.ok) {
        showToast("Workout saved!");

        resetLogWorkout();
      }
      else {
        showErrorToast("Save unsuccessful");
      }
    });
}

function getLogWorkoutUserInput() {

  const userInputs = {
      name: document.getElementById('log-workout-name-input').value,
      date: document.getElementById('log-workout-date-input').value,
      startTime: document.getElementById('log-workout-start-time-input').value,
      endTime: document.getElementById('log-workout-end-time-input').value,
      notes: document.getElementById('log-workout-notes-input').value,
      exercises: []
    }

    const exercises = document.querySelectorAll('[id*="log-workout-exercise"]'); 

      [...exercises].forEach((exercise, index) => {

      if (index === 0) {
        return;
      }

      const exerciseToAdd = {
          targetMuscleGroupId: JSON.parse(exercise.querySelector('[id*="target-muscle-group-select"]').value).id,
          exerciseId: JSON.parse(exercise.querySelector('[id*="exercise-select"]').value).id,
          sets: []
        };

      const sets = exercise.querySelectorAll('[id*="set-"]'); 

      [...sets].forEach(set => {

        const reps = set.querySelector('[id*="reps-input"]').value;

        const weight = set.querySelector('[id*="weight-input"]').value;

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

  const validateLogWorkoutUserInputResult = {
    isValidLogWorkoutUserInput: true,
    errors: []
  };

  if (isNullOrWhitespace(userInputs.name)) {

    validateLogWorkoutUserInputResult.isValidLogWorkoutUserInput = false;

    validateLogWorkoutUserInputResult.errors.push('Invalid name');
  }

  // TODO: Date cannot be null or in the future

  // TODO: Start time should not be null or exceed end time

  // TODO: End time should not be null

  // TODO: Exercises should not be empty

  [...userInputs.exercises].forEach(exercise => {

      // TODO: targetMuscleGroupId should not be null
 
      // TODO: exerciseId should not be null

      // TODO: sets should not be empty

      [...exercise.sets].forEach(set => {

        // TODO: Weight should not be null and must be greater than or equal to 0

        // TODO: Reps should not be null and must be greater than or equal to 0
      });
  });

  return validateLogWorkoutUserInputResult;
}

function getTargetMuscleGroups() {

  if (!stateManager.targetMuscleGroups) { 

    // TODO: Get target muscle group list from the server

    // TODO: Store it in stateManager.targetMuscleGroups

    // TODO: Return it. This may mean users don't have the latest list if one is added but it will save many trips to the server and as soon as they refresh, they will have the new list
  }

  // return stateManager.targetMuscleGroups;

  return [
            { id: 'Chest', name: 'Chest' },
            { id: 'Back', name: 'Back' },
            { id: 'Quads', name: 'Quads' },
            { id: 'Hamstrings', name: 'Hamstrings' }
          ]
          .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
}

function initializeTargetMuscleGroupsSelect() {

    const targetMuscleGroupsSelect = document.getElementById("target-muscle-group-select-1"); // TODO: Refactor this so it doesn't query the whole document

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

  const exerciseSelect = grandParentElement.querySelector('[id*="exercise-select"]');

  const targetMuscleGroups = getTargetMuscleGroups();

  exerciseSelect.innerHTML = '';

  if (clickedSelect.value.name === '' || !targetMuscleGroups.map(targetMuscleGroup => targetMuscleGroup.name).includes(JSON.parse(clickedSelect.value).name)) {

    exerciseSelect.disabled = true;

    return;
  }

  const exercises = getExercises(JSON.parse(clickedSelect.value).id);

    ['', ...exercises].forEach(exercise => {
      const option = document.createElement("option");
      option.value = JSON.stringify(exercise);
      option.textContent = exercise.name;
      exerciseSelect.appendChild(option); 
    });

  exerciseSelect.disabled = false;
}

function getExercises(targetMuscleGroupId) {

  fetch('https://your-api-url.com/exercises') // TODO: Get base url from appsettings
  .then(response => {
    if (!response.ok) {
      // TODO
    }
    return response.json();
  })
  .then(data => {
    // TODO
  })
  .catch(error => {
    // TODO
  });

  // TODO: Return results

  if (targetMuscleGroupId === 'Chest'){
    return [
        {id: 'test chest id 1', name: 'Barbell Bench Press'},
        {id: 'test chest id 2', name: 'Dumbbell Bench Press'},
        {id: 'test chest id 3', name: 'Machine Chest Press'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroupId === 'Back'){
    return [
        {id: 'test back id 1', name: 'Lat Pulldown'},
        {id: 'test back id 2', name: 'Cable Rows'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroupId === 'Quads'){
    return [
        {id: 'test quads id 1', name: 'Leg Extensions'}
    ]
    .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
  }

  if (targetMuscleGroupId === 'Hamstrings'){
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

function getUserBodyWeightLogs(userId) {

  // TODO: Make request with userId

  return [
    {id: 'test body weight id 1', date: new Date('2025-07-02'), weight: 187.6}, 
    {id: 'test body weight id 2', date: new Date('2025-07-01'), weight: 186.8}
  ]
  .sort((a, b) => b.date - a.date); // TODO: Mocked for now
}

function loadWorkoutHistory() {

  const workouts = getWorkouts(stateManager.userId);

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
    notes: "These are test notes",
    exercises: [
        {
            targetMuscleGroup: {
              id: "test target muscle group id 1",
              name: "test muscle group name 1"
            }, 
            exercise: {
              id: "test exercise id 1",
              name: "test exercise name 1",
              testMuscleGroupId: 'test target muscle group id 1'
            },
            sets: [
                {
                    "reps": 5,
                    "weight": 225
                }
            ]
        },
         {
            targetMuscleGroup: {
              id: "test target muscle group id 1",
              name: "test muscle group name 2"
            }, 
            exercise: {
              id: "test exercise id 2",
              name: "test exercise name 2",
              testMuscleGroupId: 'test target muscle group id 1'
            },
            sets: [
                {
                    "reps": 3,
                    "weight": 200
                },
                {
                    "reps": 2,
                    "weight": 200
                },
                {
                    "reps": 2,
                    "weight": 200
                }
            ]
        }
    ]
  };

  return mockedWorkoutDetails; // TODO: Mocked
}

function loadIndividualWorkoutHistoryPage(workoutDetails) {

  var workoutHistoryDiv = document.getElementById('workout-history-div');

  currentWorkoutHistoryDivHtml = workoutHistoryDiv.innerHTML;

  workoutHistoryDiv.innerHTML = "";

  const individualWorkoutHistoryHtml = getIndividualWorkoutHistoryHtml(workoutDetails);

  workoutHistoryDiv.innerHTML = individualWorkoutHistoryHtml;
}

function getIndividualWorkoutHistoryHtml(workoutDetails) {

  const div = document.createElement('div');

  div.innerHTML = getIndividualWorkoutBackButtonHtml();

  div.innerHTML += getIndividualWorkoutHeaderInformationHtml(workoutDetails.name, workoutDetails.date, workoutDetails.startTime, workoutDetails.endTime, workoutDetails.notes);

  const exercisesDiv = document.createElement('div');

  exercisesDiv.id = 'history-workout-exercises'

  exercisesDiv.classList.add('workout-exercises');

  [...workoutDetails.exercises].forEach((exercise, index) => {

    var exerciseHtml = getIndividualWorkoutHistoryExerciseHtml(exercise, index + 1);

    exercisesDiv.appendChild(exerciseHtml);
  });

  div.innerHTML += exercisesDiv.outerHTML;

  div.innerHTML += `
  <div style="display: flex; gap: 1%;">
    <button class="log-workout-buttons" onclick="addExercise('history')">Add Exercise </button>
    <button class="log-workout-buttons" onclick="updateWorkout()">Update Workout</button>
    <button class="delete-individual-workout-button" onclick="deleteWorkout()">Delete Workout</button>
  </div>`;

  return div.outerHTML;
}

function getIndividualWorkoutHistoryExerciseHtml(exercise, exerciseNumber) {

  const exerciseContainer = document.createElement('div');

  exerciseContainer.id = `history-exercise-${exerciseNumber}`;

  exerciseContainer.classList.add('log-workout-exercise');

  const heading = document.createElement('h2');

  heading.id = `history-exercise-heading-${exerciseNumber}`;

  heading.classList.add('exercise-heading');

  heading.innerHTML = `Exercise ${exerciseNumber}`;

  exerciseContainer.appendChild(heading);

  const formGroup = document.createElement('div');

  formGroup.id = `history-workout-exercise-${exerciseNumber}`;

  formGroup.classList.add('form-group');

  const table = document.createElement('div');

  table.style.display = 'table';

  const targetMuscleGroupRow = document.createElement('div');

  targetMuscleGroupRow.style.display = 'table-row';

  targetMuscleGroupRow.innerHTML = `
    <label for="history-target-muscle-group-select-${exerciseNumber}" style="display: table-cell; padding-right: 10px;">Target Muscle Group:</label>
    <select 
      id="history-target-muscle-group-select-${exerciseNumber}" 
      class="log-workout-select" 
      style="display: table-cell;" 
      onchange="handleTargetMuscleGroupSelectionChange()">
      <option value="${exercise.targetMuscleGroup.id}">${exercise.targetMuscleGroup.name}</option>
    </select>`;

  const exerciseRow = document.createElement('div');

  exerciseRow.style.display = 'table-row';

  exerciseRow.innerHTML = `
    <label for="history-exercise-select-${exerciseNumber}" style="display: table-cell;">Exercise:</label>
    <select disabled id="history-exercise-select-${exerciseNumber}" class="log-workout-select" style="display: table-cell;">
      <option value="${exercise.exercise.id}">${exercise.exercise.name}</option>
    </select>`;

  table.appendChild(targetMuscleGroupRow);

  table.appendChild(exerciseRow);

  formGroup.appendChild(table);

  exercise.sets.forEach((set, setIndex) => {

    const setNumber = setIndex + 1;

    const setDiv = document.createElement('div');

    setDiv.id = `history-set-${setNumber}`;

    setDiv.className = 'workout-sets';

    setDiv.style.display = 'table';

    setDiv.innerHTML = `
      <h3 class="set-heading">Set ${setNumber} <button class="workout-set-note-button">&#128221</button> ${setNumber === 1 ? `` : `<button onclick="deleteSet()" class="delete-button"> X </button>`}</h3>
      <div class="form-group" style="display: table-row;">
        <label style="display: table-cell; text-align: right;">Weight:</label>
        <input id="history-weight-input-${exerciseNumber}-${setNumber}" type="number" step="any" class="log-workout-set-inputs" style="display: table-cell;" value="${set.weight}">
      </div>    
      <div class="form-group" style="display: table-row;">
        <label style="display: table-cell; text-align: right;">Reps:</label>                                   
        <input id="history-reps-input-${exerciseNumber}-${setNumber}" type="number" step="1" class="log-workout-set-inputs" style="display: table-cell;" value="${set.reps}">
      </div> 
    `;

    formGroup.appendChild(setDiv);
  });

  formGroup.innerHTML += `<button class="log-workout-buttons" onclick="addSet()">Add Set </button>`

  exerciseContainer.appendChild(formGroup);

  exerciseContainer.innerHTML +=  `<button class="log-workout-buttons">Add Note &#128221</button> ${exerciseNumber === 1 ? `` : `<button onclick="deleteExercise()" class="delete-button"> [X] Delete </button>`}`;

  return exerciseContainer;
}

function getIndividualWorkoutBackButtonHtml() {
  return `<button class="back-to-workout-history-list-button" onclick="handleBackToWorkoutHistoryListButtonClick()">← Back</button>`;
}

function getIndividualWorkoutHeaderInformationHtml(name, date, startTime, endTime, notes) {
  return `
    <div class="log-workout-header-group">
      <div class="log-new-workout-date-group">
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell; padding-right: 55px;">Name:</label>
                <input type="text" class="input-modern" placeholder="Enter workout name" value="${name}" style="display: table-cell;">                                     
            </div>
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell; padding-right: 55px;">Date:</label>
                <input type="date" class="log-workout-inputs" value="${date.toISOString().split('T')[0]}" style="display: table-cell;">                                     
            </div>
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell;">Start Time:</label>
                <input type="time" class="log-workout-inputs" value="${startTime}" style="display: table-cell;">                                     
            </div>
            <div class="form-group" style="display: table-row;">
                <label style="display: table-cell;">End Time:</label>
                <input type="time" class="log-workout-inputs" value="${endTime}" style="display: table-cell;"> 
            </div>
        </div>
        <div class="log-workout-notes-div">
          <label>Workout Notes:</label>
          <textarea class="textarea-modern" placeholder="Enter notes about your workout...">${notes}</textarea>                                   
        </div>
    </div>`;
}

function handleBackToWorkoutHistoryListButtonClick() {

  const workoutHistoryDiv = document.getElementById('workout-history-div');

  workoutHistoryDiv.innerHTML = currentWorkoutHistoryDivHtml;
}

function handleDeleteIndividualWorkoutHistoryClick() {
  var workoutId = event.target.value;

  // TODO: Show confirmation dialog.
}

function deleteIndividualWorkout(workoutId) {
  // TODO: Send workoutId to server

  // TODO: Return true if successful or false if unsuccessful
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

  document.getElementById('log-workout-name-input').value = '';

  document.getElementById('log-workout-date-input').value = '';

  document.getElementById('log-workout-start-time-input').value = '';

  document.getElementById('log-workout-end-time-input').value = '';

  document.getElementById('log-workout-notes-input').value = '';

  var logworkoutexercises = document.getElementById('workout-exercises');

  logworkoutexercises.innerHTML = '';

  const newDiv = document.createElement('div');

  newDiv.classList.add('log-workout-exercise');

  newDiv.id = 'exercise-1';

  newDiv.innerHTML = getExerciseHtml(1); 

  const targetMuscleGroupsSelect = newDiv.querySelector(`[id="target-muscle-group-select-1"]`)

  populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect);

  logworkoutexercises.innerHTML = newDiv.outerHTML;
}

function handleResetButtonClick() {
  showConfirmDialog();
}

function showConfirmDialog() {
  document.getElementById("confirm-dialog").style.display = "flex";
}

function handleResetNoButtonClick() {
  document.getElementById("confirm-dialog").style.removeProperty("display");
}

function handleResetYesButtonClick() {

  resetLogWorkout();

  document.getElementById("confirm-dialog").style.removeProperty("display");
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

function isNullOrWhitespace(input) {
  return !input || input.trim().length === 0;
}