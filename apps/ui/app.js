window.addEventListener("load", initializeTargetMuscleGroupsSelect, false);

let currentlySelectedSection = "";

const stateManager = {
  userId: null,
  currentlySelectedSection: "",
  targetMuscleGroups: null,
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
        <h3 class="set-heading">Set ${setNumber} <button class="workout-set-note-button">&#128221</button> ${setNumber === 1 ? `` : `<button onclick="deleteSet()" class="delete-set-button"> X </button>`} </h3>
          <div class="form-group" style="display: table-row;">
            <label style="display: table-cell; text-align: right; padding-right: 4%;">Weight:</label>
            <input id="weight-input-${setNumber}" type="number" step="any" class="log-workout-set-inputs" style="display: table-cell;">
        </div> 
        <div class="form-group" style="display: table-row;">
            <label style="display: table-cell; text-align: right; padding-right: 4%;">Reps:</label>                                   
            <input id="reps-input-${setNumber}" type="number" step="1" class="log-workout-set-inputs" style="display: table-cell;">           
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
          <button class="log-workout-buttons">Add Note &#128221</button> ${exerciseNumber === 1 ? `` : `<button onclick="deleteExercise()" class="delete-exercise-button"> [X] Delete </button>`}`;
}

function deleteExercise() {

    const clickedButton = event.target;

    const parentElement = clickedButton.parentElement;

    const grandParentElement = parentElement.parentElement;

    grandParentElement.removeChild(parentElement);

    const exerciseHeadings = 
      [...grandParentElement.querySelectorAll('[id*="exercise-heading-"]')];

      let numberOfExercises = 1;

      exerciseHeadings.forEach(heading => {
        
        heading.innerHTML = `Exercise ${numberOfExercises}`;

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

function initializeTargetMuscleGroupsSelect() {

    const targetMuscleGroupsSelect = document.getElementById("target-muscle-group-select-1"); // TODO: Refactor this so it doesn't query the whole document

    populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect);
}

function populateTargetMuscleGroupsSelect(targetMuscleGroupsSelect) {

  targetMuscleGroupsSelect.innerHTML = '';

    if (!stateManager.targetMuscleGroups) { 

      stateManager.targetMuscleGroups = getTargetMuscleGroups();
    }

    [{id: '', name: ''}, ...stateManager.targetMuscleGroups].forEach(targetMuscleGroup => {
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
