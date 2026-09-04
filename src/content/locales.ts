export const LOCALES_EN: Record<string, string> = {
  // Common UI
  'app.title': 'Robo Paths',
  'app.subtitle': 'A toy that teaches programming',
  'app.play': 'Play',
  'app.continue': 'Continue',
  'app.chooseRobot': 'Choose Robot',
  'app.settings': 'Settings',
  'app.backToMap': 'Back to Map',
  'app.nextLevel': 'Next Level',
  'app.retry': 'Try Again',
  'app.reset': 'Reset',
  'app.run': 'Run Program',
  'app.pause': 'Pause',
  'app.resume': 'Resume',
  'app.step': 'Step',
  'app.clear': 'Clear',
  'app.undo': 'Undo',
  'app.redo': 'Redo',
  'app.hints': 'Hint',
  'app.boardExplorer': 'Board Explorer',
  'app.blocks': 'Blocks',
  'app.actions': 'Actions',
  'app.goal': 'Goal',
  'app.requiredBatteries': 'Batteries',
  'app.stars': 'Stars',

  // Outcomes & Feedback
  'outcome.success.title': 'Awesome!',
  'outcome.success.message': 'Your robot reached the goal!',
  'outcome.blocked.wall': 'That tile has a wall. Try another turn.',
  'outcome.blocked.void': 'That tile is off the edge. Try turning earlier.',
  'outcome.blocked.closed_gate': 'This gate is closed! Find its matching switch.',
  'outcome.incomplete': 'More blocks might help reach the flag.',
  'outcome.out_of_actions': 'This route needs more actions. Try a shorter path.',

  // Levels & Hints
  'level.w1-01.title': 'First steps',
  'level.w1-01.hint.1': 'Your robot needs to move forward towards the flag.',
  'level.w1-01.hint.2': 'Look at the green tiles ahead: each Forward command advances one tile.',
  'level.w1-01.hint.3': 'Place two Forward commands in your program and press Run!',

  'level.w1-02.title': 'Round the corner',
  'level.w1-02.hint.1': 'The flag is around the right turn.',
  'level.w1-02.hint.2': 'Walk forward to the corner tile, turn right, then continue forward.',
  'level.w1-02.hint.3': 'Use: Forward, Forward, Turn Right, Forward, Forward.',

  'level.w1-03.title': 'Turn the other way',
  'level.w1-03.hint.1': 'Now you will need to turn left!',
  'level.w1-03.hint.2': 'Walk forward, turn left to face north, then turn right to face east.',
  'level.w1-03.hint.3': 'Follow the path: Forward, Turn Left, Forward, Forward, Turn Right, Forward.',

  'level.w1-04.title': 'Battery delivery',
  'level.w1-04.hint.1': 'Pick up the blue battery before reaching the flag.',
  'level.w1-04.hint.2': 'Robots collect items automatically when stepping on their tile.',
  'level.w1-04.hint.3': 'Just walk straight ahead across the battery all the way to the flag!',

  'level.w1-05.title': 'A star detour',
  'level.w1-05.hint.1': 'There is an optional bonus star on the side path!',
  'level.w1-05.hint.2': 'You can go straight for a quick finish, or take the detour for a bonus star.',
  'level.w1-05.hint.3': 'To collect the star: Forward, Turn Right, Forward, Turn Left, Forward, Turn Left, Forward.',

  'level.w1-06.title': 'Around the rock',
  'level.w1-06.hint.1': 'A large rock is blocking the straight path ahead!',
  'level.w1-06.hint.2': 'Turn right first to detour around the rock and collect the battery.',
  'level.w1-06.hint.3': 'Turn Right, Forward, Turn Left, Forward, Forward, Turn Left, Forward, Turn Right.',
};

export function t(key: string): string {
  return LOCALES_EN[key] || key;
}
