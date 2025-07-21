function handleSaveWorkoutButtonClick() {

    const userInputs = getLogWorkoutUserInput();

    var validateLogWorkoutUserInputResult = validateLogWorkoutUserInput(userInputs);

    if (!validateLogWorkoutUserInputResult.isValidLogWorkoutUserInput) {

      // TODO: Indicate to the user what is wrong with the input

      return;
    }
    
    var successful = saveWorkout();

    if (successful === true) {
      showToast("Workout saved!");

      resetLogWorkout();
    }
    else {
      showErrorToast("Save unsuccessful");
    }
}

function getLogWorkoutUserInput() {

  const userInputs = {
      name: document.getElementById('log-workout-name-input').value, // TODO: Vulnerable to XSS. Code can be injected here and then ran on workout history list page
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

function handleTodayButtonClick() {

  const clickedSelect = event.target;

  const parentElement = clickedSelect.parentElement;

  dateInput = parentElement.querySelector('#log-workout-date-input');

  todaysDateAsString = new Date().toISOString().split('T')[0];

  dateInput.value = todaysDateAsString;
}

function handleStartTimeButtonClick() {

  const clickedSelect = event.target;

  const parentElement = clickedSelect.parentElement;

  timeInput = parentElement.querySelector('#log-workout-start-time-input');

  now = new Date();

  hoursString = now.getHours().toString().padStart(2, '0');

  minutesString = now.getMinutes().toString().padStart(2, '0');

  timeInput.value = `${hoursString}:${minutesString}`;
}

function handleEndTimeButtonClick() {

  const clickedSelect = event.target;

  const parentElement = clickedSelect.parentElement;

  timeInput = parentElement.querySelector('#log-workout-end-time-input');

  now = new Date();

  hoursString = now.getHours().toString().padStart(2, '0');

  minutesString = now.getMinutes().toString().padStart(2, '0');

  timeInput.value = `${hoursString}:${minutesString}`;
}
