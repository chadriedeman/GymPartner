let apiBaseUrl = ""; // TODO: Set in a function that pulls this from config file

function getExercises(targetMuscleGroupId) {

  fetch(`${apiBaseUrl}/exercises?targetMuscleGroupId=${targetMuscleGroupId}`, {
      method: 'GET',
   })
  .then(response => {

    if (!response.ok) {
      // TODO
    }

    return response.json();
  })
  .then(data => {
    // TODO: Return results
  })
  .catch(error => {
    // TODO
  });

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

  fetch(`${apiBaseUrl}/settings`, {
      method: 'GET',
   })
  .then(response => {
    
    if (!response.ok) {
      // TODO
    }

    return response.json();
  })
  .then(data => {
    // TODO: Return results
  })
  .catch(error => {
    // TODO
  });

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

  fetch(`${apiBaseUrl}/body-weight-logs`, {
      method: 'GET',
  })
  .then(response => {
    
    if (!response.ok) {
      // TODO
    }

    return response.json();
  })
  .then(data => {
    // TODO: Return results
  })
  .catch(error => {
    // TODO
  });

  return [
    {id: 'test body weight id 1', date: new Date('2025-07-02'), weight: 187.6}, 
    {id: 'test body weight id 2', date: new Date('2025-07-01'), weight: 186.8}
  ]
  .sort((a, b) => b.date - a.date); // TODO: Mocked for now
}

function getIndividualWorkout(workoutId) {
  
  fetch(`${apiBaseUrl}/workouts/${workoutId}`, {
      method: 'GET',
   })
  .then(response => {
    
    if (!response.ok) {
      // TODO
    }

    return response.json();
  })
  .then(data => {
    // TODO: Return results
  })
  .catch(error => {
    // TODO
  });

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

function deleteWorkout(workoutId) {

   fetch(`${apiBaseUrl}/workouts`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        return true;
      }
      else {
        return false;
      }
    })
    .catch(error =>{
      return false;
    });

  // TODO: Return true if successful or false if unsuccessful
}

function saveWorkout(userId, workoutDetails) {

 fetch(`${apiBaseUrl}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutDetails)
    })
    .then(response => {
      if (response.ok) {
        return true;
      }
      else {
        return false;
      }
    })
    .catch(error =>{
      return false;
    });
}

function getTargetMuscleGroups() {

    // TODO: Get target muscle group list from the server

    // TODO: Store it in stateManager.targetMuscleGroups

    // TODO: Return it. This may mean users don't have the latest list if one is added but it will save many trips to the server and as soon as they refresh, they will have the new list

  return [
            { id: 'Chest', name: 'Chest' },
            { id: 'Back', name: 'Back' },
            { id: 'Quads', name: 'Quads' },
            { id: 'Hamstrings', name: 'Hamstrings' }
          ]
          .sort((a, b) => a.name.localeCompare(b.name)); // TODO: Mocked for now
}