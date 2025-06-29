const Goal = require('../models/goal');

async function pairWeeklyGoals() {
  const pendingGoals = await Goal.find({ status: 'pending' });

  // These goals are grouped by userId
  const userGoalsMap = new Map();
  for (const goal of pendingGoals) {
    const uid = goal.userId.toString();
    if (!userGoalsMap.has(uid)) userGoalsMap.set(uid, []);
    userGoalsMap.get(uid).push(goal);
  }

  const users = Array.from(userGoalsMap.keys());
  const pairedUsers = new Set();

  for (let i = 0; i < users.length; i++) {
    const userA = users[i];
    if (pairedUsers.has(userA)) continue;

    for (let j = i + 1; j < users.length; j++) {
      const userB = users[j];
      if (pairedUsers.has(userB)) continue;

      const goalsA = userGoalsMap.get(userA).flatMap(g => g.goals);
      const goalsB = userGoalsMap.get(userB).flatMap(g => g.goals);
      const similarity = getGoalSimilarity(goalsA, goalsB);

      if (similarity >= 0.4) {
        await Goal.updateMany(
          { userId: userA, status: 'pending' },
          { status: 'in_progress', pairedWith: userB }
        );
        await Goal.updateMany(
          { userId: userB, status: 'pending' },
          { status: 'in_progress', pairedWith: userA }
        );
        pairedUsers.add(userA);
        pairedUsers.add(userB);
        break;
      }
    }
  }

  console.log('✅ Weekly pairing completed.');
}

function getGoalSimilarity(goalsA, goalsB) {
  const setA = new Set(goalsA.map(g => g.toLowerCase()));
  const setB = new Set(goalsB.map(g => g.toLowerCase()));
  const intersection = [...setA].filter(g => setB.has(g));
  return intersection.length / Math.max(goalsA.length, goalsB.length);
}

module.exports = { pairWeeklyGoals };