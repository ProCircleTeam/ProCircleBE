const express = require('express');
const router = express.Router();
const db = require('../models');
const Goal = db.Goal;

// POST /api/pair-goals
router.post('/pair-goals', async (req, res) => {
  try {
    const pendingGoals = await Goal.findAll({ where: { status: 'pending' } });

    const userGoalsMap = new Map();
    for (const goal of pendingGoals) {
      const uid = goal.userId;
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
          await Goal.update({ status: 'in_progress', pairedWith: userB }, { where: { userId: userA, status: 'pending' } });
          await Goal.update({ status: 'in_progress', pairedWith: userA }, { where: { userId: userB, status: 'pending' } });
          pairedUsers.add(userA);
          pairedUsers.add(userB);
          break;
        }
      }
    }

    res.status(200).json({ message: '✅ Pairing completed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getGoalSimilarity(goalsA, goalsB) {
  const setA = new Set(goalsA.map(g => g.toLowerCase()));
  const setB = new Set(goalsB.map(g => g.toLowerCase()));
  const intersection = [...setA].filter(g => setB.has(g));
  return intersection.length / Math.max(goalsA.length, goalsB.length);
}

module.exports = router;
