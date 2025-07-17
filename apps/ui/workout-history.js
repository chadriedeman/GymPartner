let currentWorkoutHistoryDivHtml = "";

function loadWorkoutHistory() {
  const workouts = getWorkouts(stateManager.userId);
  const workoutHistoryDiv = document.getElementById('workout-history-div');
  workoutHistoryDiv.innerHTML = "";

  workouts.forEach(workout => {
    const newDiv = document.createElement('div');
    newDiv.classList.add('workout-history-card');

    newDiv.innerHTML = `
      <div class="workout-history-header">
        <div class="workout-history-date">${workout.date.toISOString().split('T')[0]}</div>
        <div class="workout-history-buttons">
          <button class="individual-workout-details-button" onclick="handleGetIndividualWorkoutHistoryClick()" value="${workout.id}">Details</button>
          <button class="workout-history-delete-button" onclick="handleDeleteIndividualWorkoutHistoryClick()" value="${workout.id}">[X] Delete</button>
        </div>
      </div>
      <div class="workout-history-name">${workout.name}</div>
    `;

    workoutHistoryDiv.appendChild(newDiv);
  });
}

function handleGetIndividualWorkoutHistoryClick() {

  var workoutId = event.target.value;

  var workoutDetails = getIndividualWorkout(workoutId);

  var workoutHistoryTimeframeSelect = document.getElementById('workout-history-timeframe-select-1');

  var workoutHistoryTimeframeSelectLabel = document.getElementById('workout-history-timeframe-select-1-label');

  workoutHistoryTimeframeSelect.style.visibility = 'hidden';

  workoutHistoryTimeframeSelectLabel.style.visibility = 'hidden';

  loadIndividualWorkoutHistoryPage(workoutDetails);
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

  div.innerHTML += getIndividualWorkoutHeaderInformationHtml(workoutDetails.name, workoutDetails.date, workoutDetails.startTime, workoutDetails.endTime);

  const exercisesDiv = document.createElement('div');

  exercisesDiv.id = 'history-workout-exercises'

  exercisesDiv.classList.add('workout-exercises');

  [...workoutDetails.exercises].forEach((exercise, index) => {

    var exerciseHtml = getIndividualWorkoutHistoryExerciseHtml(exercise, index + 1);

    exercisesDiv.appendChild(exerciseHtml);
  });

  div.innerHTML += exercisesDiv.outerHTML;

  div.innerHTML += `
    <div class="log-workout-notes-container">
      <label for="log-workout-notes-input" class="notes-label">Workout Notes <span class="optional">(optional)</span></label>
      <textarea id="log-workout-notes-input" class="notes-textarea" placeholder="Optional: Add notes about how you felt, PRs, injuries, etc.">${workoutDetails.notes}</textarea>
    </div>`;

  div.innerHTML += `
  <div style="display: flex; gap: 1%;">
    <button class="log-workout-buttons" onclick="addExercise('history')">Add Exercise </button>
    <button class="log-workout-buttons" onclick="updateWorkout()">Update Workout</button>
    <button class="delete-individual-workout-button" onclick="handleDeleteWorkoutButtonClick()"> [X] Delete Workout</button>
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
        <label style="display: table-cell; text-align: right; padding-right: 4%;">Weight:</label>
        <input id="history-weight-input-${exerciseNumber}-${setNumber}" type="number" step="any" class="log-workout-set-inputs" style="display: table-cell;" value="${set.weight}">
      </div>    
      <div class="form-group" style="display: table-row;">
        <label style="display: table-cell; text-align: right; padding-right: 4%;">Reps:</label>                                   
        <input id="history-reps-input-${exerciseNumber}-${setNumber}" type="number" step="1" class="log-workout-set-inputs" style="display: table-cell;" value="${set.reps}">
      </div> 
    `;

    formGroup.appendChild(setDiv);
  });

  formGroup.innerHTML += `<button class="log-workout-buttons" onclick="addSet()">Add Set </button>`

  exerciseContainer.appendChild(formGroup);

  exerciseContainer.innerHTML +=  `<button class="log-workout-buttons">Add Note &#128221</button> ${exerciseNumber === 1 ? `` : `<button onclick="deleteExercise()" class="delete-exercise-button"> [X] Delete </button>`}`;

  return exerciseContainer;
}

function getIndividualWorkoutBackButtonHtml() {
  return `
  <div class="log-workout-header-container">
    <button class="back-to-workout-history-list-button" onclick="handleBackToWorkoutHistoryListButtonClick()">← Back</button>
  </div>`;
}

function getIndividualWorkoutHeaderInformationHtml(name, date, startTime, endTime) {
  return `
    <div class="log-workout-details-container">
      <h2 class="section-subheading">Workout Details</h2>
      <div class="log-workout-detail-row">
        <label for="log-workout-name-input">Name</label>
        <input id="log-workout-name-input" type="text" class="input-modern" placeholder="Enter workout name" value="${name}">
      </div>

      <div class="log-workout-detail-row">
        <label for="log-workout-date-input">Date</label>
        <div class="input-with-button">
          <input id="log-workout-date-input" type="date" value="${date.toISOString().split('T')[0]}">
          <button type="button" onclick="handleTodayButtonClick()" title="Set to Today">&#x1F4C5;</button>
        </div>
      </div>

      <div class="log-workout-detail-row">
        <label for="log-workout-start-time-input">Start</label>
        <div class="input-with-button">
          <input id="log-workout-start-time-input" type="time" value="${startTime}">
          <button type="button" onclick="handleStartTimeButtonClick()" title="Set to Now">&#x1F552;</button>
        </div>
      </div>

      <div class="log-workout-detail-row">
        <label for="log-workout-end-time-input">End</label>
        <div class="input-with-button">
          <input id="log-workout-end-time-input" type="time" value="${endTime}">
          <button type="button" onclick="handleEndTimeButtonClick()" title="Set to Now">&#x1F552;</button>
        </div>
      </div>
    </div>`;
}

function handleBackToWorkoutHistoryListButtonClick() {

  const workoutHistoryDiv = document.getElementById('workout-history-div');

  var workoutHistoryTimeframeSelect = document.getElementById('workout-history-timeframe-select-1');

  var workoutHistoryTimeframeSelectLabel = document.getElementById('workout-history-timeframe-select-1-label');

  workoutHistoryTimeframeSelect.style.visibility = 'visible';

  workoutHistoryTimeframeSelectLabel.style.visibility = 'visible';

  workoutHistoryDiv.innerHTML = currentWorkoutHistoryDivHtml;
}

function handleDeleteIndividualWorkoutHistoryClick() {
  var workoutId = event.target.value;

  // TODO: Show confirmation dialog.
}

function handleDeleteWorkoutButtonClick() {

  // TODO: Display confirmation dialog

  // TODO: If "no", return

  // TOOD: Else:

  // TOOD: Get button element

  // TODO: Get workout Id

  // TODO: Send workout id to server

  // TODO: If deletion successful on server, then clear current individual workout history html, get updated workout history list from server, load workout history list page

  // TODO: Else, display error message
}

function handleWorkoutHistoryTimeframeSelectionChange() {
  // TODO
}