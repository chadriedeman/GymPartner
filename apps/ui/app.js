 let numberOfExercises = 1;

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
        .forEach(s => s.classList.remove('active'));

      document
        .getElementById(id)
        .classList
        .add('active');
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

        newDiv.innerHTML = `
            <div class="log-workout-sets" style="display: table;">
                <h3 class="set-heading">Set 1 <button onclick="deleteSet()" class="delete-button"> X </button></h3>                                                <!-- TODO: Need to dynamically set the number so that it updates when adding more sets -->
                <div class="form-group" style="display: table-row;">
                    <label style="display: table-cell; text-align: right;">Reps:</label>                                   
                    <input type="number" step="1" class="log-workout-inputs" style="display: table-cell;">            <!-- TODO: Validation that to ensure user input is a number -->
                </div>
                <div class="form-group" style="display: table-row;">
                    <label style="display: table-cell; text-align: right;">Weight:</label>
                    <input type="number" step="any" class="log-workout-inputs" style="display: table-cell;">            <!-- TODO: Validation that to ensure user input is a number -->
                </div>    
            </div>`;

        const parentDiv = clickedButton.parentElement;

        numberOfParentDivChildElements = parentDiv.children.length;

        const lastSetElement = parentDiv.children[numberOfParentDivChildElements - 2]; 

        parentDiv.insertBefore(newDiv, lastSetElement);
    }

    function deleteExercise() {

        const clickedButton = event.target;

        const parentElement = clickedButton.parentElement;

        const grandParentElement = parentElement.parentElement;

        const greatGrandParentElement = grandParentElement.parentElement;

        greatGrandParentElement.removeChild(grandParentElement);
    }

    function deleteSet() {

        const clickedButton = event.target;

        const parentElement = clickedButton.parentElement;

        const grandParentElement = parentElement.parentElement;

        const greatGrandParentElement = grandParentElement.parentElement;

        greatGrandParentElement.removeChild(grandParentElement);
    }

    function addExercise() {

        const logworkoutexercisesDiv = document.getElementById("logworkoutexercises");

        const newDiv = document.createElement('div');

        numberOfExercises++;

        newDiv.innerHTML = `
            <h2 class="exercise-heading">Exercise ${numberOfExercises} <button onclick="deleteExercise()" class="delete-button"> X </button></h2>
            <div class="form-group"> 
              <div style="display: table;">
                <div style="display: table-row;">
                  <label for="targetmusclegroupselect" style="display: table-cell; padding-right: 10px;">Target Muscle Group:</label>
                  <select id="targetmusclegroupselect" class="log-workout-select" style="display: table-cell;" onclick="populateTargetMuscleGroups()"> </select>         <!-- TODO: Needs to be a dropdown that auto populates by fetching the values from the backend -->
                </div>
                <div style="display: table-row;">
                  <label for="exerciseselect" style="display: table-cell;">Exercise:</label>
                  <select id="exerciseselect" class="log-workout-select" style="display: table-cell;"></select>          <!-- TODO: Needs to be a dropdown that auto populates by fetching the values from the backend -->
                </div>
              </div>
              <div class="log-workout-sets" style="display: table;">
                  <h3 class="set-heading">Set 1 <button onclick="deleteSet()" class="delete-button"> X </button></h3>  <!-- TODO: Need to dynamically set the number so that it updates when adding more sets -->
                  <div class="form-group" style="display: table-row;">
                      <label style="display: table-cell; text-align: right;">Reps:</label>                                   
                      <input type="number" step="1" class="log-workout-inputs" style="display: table-cell;">            <!-- TODO: Validation that to ensure user input is an integer -->
                  </div>
                  <div class="form-group" style="display: table-row;">
                      <label style="display: table-cell; text-align: right;">Weight:</label>
                      <input type="number" step="any" class="log-workout-inputs" style="display: table-cell;">
                  </div>    
              </div>
              <button onclick="addSet()">Add Set </button>  `;

            logworkoutexercisesDiv.appendChild(newDiv);
    }

    function saveWorkout() {
        // TODO: Get section values
        
        // TODO: Send to server

        // TODO: If successful response, display message and reset page 

        // TODO: Else, display error message
    }

    function getTargetMuscleGroups() {
      return [
              'Chest',
              'Back', 
              'Quads',
              'Hamstrings'
            ]
            .sort(); // TODO: Mocked for now
    }

    function populateTargetMuscleGroups() {

       const clickedSelect = event.target;

       clickedSelect.innerHTML = '';

       const targetMuscleGroups = getTargetMuscleGroups();

       ['', ...targetMuscleGroups].forEach(targetMuscleGroup => {
          const option = document.createElement("option");
          option.value = targetMuscleGroup;
          option.textContent = targetMuscleGroup;
          clickedSelect.appendChild(option); 
       });
    }

    function handleTargetMuscleGroupSelectionChange() {

      const clickedSelect = event.target;

      // TODO: If a valid selection is made

      // TODO: Get available exercises from server

      // TODO: Populate the exercise select with values

      // TODO: Enable exercise select
      const parentElement = clickedSelect.parentElement;

      const grandParentElement = parentElement.parentElement;

      const exerciseSelect = grandParentElement.querySelector('[id="exerciseselect"]');

      exerciseSelect.disabled = false;
    }

    function getExercises() {

      // TODO: Get target muscle group input

      // TODO: Send to server

      // TODO: Return results

      return [
        'Barbell Bench Press',
        'Dumbbell Bench Press', 
        'Machine Chest Press'
      ]
      .sort(); // TODO: Mocked for now
    }

    function getUserBodyWeightLogs() {
      return [
        {date: new Date('2025-07-02'), weight: 187.6}, 
        {date: new Date('2025-07-01'), weight: 186.8}
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