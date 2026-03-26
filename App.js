/* eslint-disable */

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Zap, Brain, Clock, Target, Award, ChevronRight, Medal, Moon, Sun, Download, Filter, ShieldHalf, Swords } from 'lucide-react';


const mockWebSocket = {
  rooms: {},
  createRoom: function(roomCode, playerName) {
    this.rooms[roomCode] = {
      host: playerName,
      players: [playerName],
      status: 'waiting',
      questions: [],
      scores: { [playerName]: 0 },
      answers: {}
    };
    return roomCode;
  },
  joinRoom: function(roomCode, playerName) {
    if (this.rooms[roomCode] && this.rooms[roomCode].status === 'waiting') {
      this.rooms[roomCode].players.push(playerName);
      this.rooms[roomCode].scores[playerName] = 0;
      this.rooms[roomCode].status = 'ready';
      return true;
    }
    return false;
  },
  startGame: function(roomCode, questions) {
    if (this.rooms[roomCode]) {
      this.rooms[roomCode].status = 'playing';
      this.rooms[roomCode].questions = questions;
      this.rooms[roomCode].currentQuestion = 0;
    }
  }
};

// Multiplayer setup component
const MultiplayerSetup = ({ darkMode, onBack, onCreateRoom, onJoinRoom }) => {
  const cardClass = darkMode 
    ? 'bg-slate-900/80 backdrop-blur-xl border-purple-500/30' 
    : 'bg-white/80 backdrop-blur-xl border-purple-300';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const [joinCode, setJoinCode] = useState('');

  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${textClass} flex items-center gap-2`}>
          🌐 Multiplayer Battle
        </h3>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-all text-white"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Room */}
        <div className={`p-6 rounded-xl border-2 border-green-500/30 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
          <div className="text-4xl mb-4">🏠</div>
          <h4 className={`text-xl font-bold ${textClass} mb-2`}>Create Room</h4>
          <p className={`${textSecondary} text-sm mb-4`}>
            Host a new multiplayer game. Share the code with your friend!
          </p>
          <button
            onClick={onCreateRoom}
            className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
          >
            🎮 Create Game Room
          </button>
        </div>

        {/* Join Room */}
        <div className={`p-6 rounded-xl border-2 border-blue-500/30 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <div className="text-4xl mb-4">🔗</div>
          <h4 className={`text-xl font-bold ${textClass} mb-2`}>Join Room</h4>
          <p className={`${textSecondary} text-sm mb-4`}>
            Enter a room code to join your friend's game
          </p>
          <input
            type="text"
            placeholder="Enter room code..."
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            className={`w-full px-4 py-3 mb-3 ${
              darkMode ? 'bg-slate-800 border-blue-500/30 text-white' : 'bg-white border-blue-300 text-gray-900'
            } border rounded-xl placeholder-gray-400 focus:outline-none focus:border-blue-500`}
            maxLength={6}
          />
          <button
            onClick={() => onJoinRoom(joinCode)}
            disabled={!joinCode.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            🎯 Join Game
          </button>
        </div>
      </div>

      <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} text-center`}>
        <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
          🌍 <strong>Real Multiplayer:</strong> Play with friends on different devices!
        </p>
      </div>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const WaitingRoom = ({ darkMode, roomCode, connectedPlayers, onStartGame, onCancel }) => {
  const cardClass = darkMode 
    ? 'bg-slate-900/80 backdrop-blur-xl border-purple-500/30' 
    : 'bg-white/80 backdrop-blur-xl border-purple-300';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${cardClass} rounded-2xl p-8 border text-center`}>
      <div className="text-6xl mb-4">⏳</div>
      <h3 className={`text-3xl font-bold ${textClass} mb-2`}>Waiting for Players</h3>
      
      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
        <p className={`text-2xl font-mono font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
          Room Code: {roomCode}
        </p>
        <p className={textSecondary}>Share this code with your friend!</p>
      </div>

      <div className="mb-6">
        <h4 className={`text-lg font-bold ${textClass} mb-3`}>Connected Players:</h4>
        <div className="space-y-2">
          {connectedPlayers.map((player, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg ${
                darkMode ? 'bg-slate-800' : 'bg-gray-100'
              } flex items-center gap-3`}
            >
              <span className="text-2xl">
                {index === 0 ? '👑' : '🎯'}
              </span>
              <span className={textClass}>{player}</span>
              {index === 0 && (
                <span className={`text-xs px-2 py-1 rounded ${
                  darkMode ? 'bg-purple-600' : 'bg-purple-500 text-white'
                }`}>
                  Host
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {connectedPlayers.length >= 2 ? (
        <div className="space-y-3">
          <button
            onClick={onStartGame}
            className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-white transition-all"
          >
            🚀 Start Battle ({connectedPlayers.length}/2 Players)
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 bg-gray-600 hover:bg-gray-500 rounded-xl font-semibold text-white transition-all"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <p className={textSecondary}>
              ⏰ Waiting for {2 - connectedPlayers.length} more player...
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-full py-3 bg-gray-600 hover:bg-gray-500 rounded-xl font-semibold text-white transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const checkAchievements = (user, battleResult = null, fastAnswers = 0, maxStreak = 0) => {
  const newAchievements = [];
  
  console.log('Checking achievements for user:', user.name);
  console.log('Current achievements:', user.achievements);
  console.log('Battle result:', battleResult);
  console.log('Fast answers:', fastAnswers, 'Max streak:', maxStreak);
  
  // Original achievements
  if (user.gamesPlayed >= 1 && !user.achievements?.includes('first_win')) {
    newAchievements.push('first_win');
    console.log('🎯 Unlocked: first_win');
  }
  
  if (fastAnswers >= 5 && !user.achievements?.includes('speed_demon')) {
    newAchievements.push('speed_demon');
    console.log('🎯 Unlocked: speed_demon');
  }
  
  if (maxStreak >= 10 && !user.achievements?.includes('streak_master')) {
    newAchievements.push('streak_master');
    console.log('🎯 Unlocked: streak_master');
  }
  
  if (user.totalPoints >= 1000 && !user.achievements?.includes('grandmaster')) {
    newAchievements.push('grandmaster');
    console.log('🎯 Unlocked: grandmaster');
  }
  
  if (user.gamesPlayed >= 50 && !user.achievements?.includes('quiz_veteran')) {
    newAchievements.push('quiz_veteran');
    console.log('🎯 Unlocked: quiz_veteran');
  }
  
  // ✅ FIXED: Battle achievements with proper battle result checking
  if (battleResult) {
    const { won, wasPerfect, wasComeback } = battleResult;
    
    if (won && !user.achievements?.includes('first_blood')) {
      newAchievements.push('first_blood');
      console.log('🎯 Unlocked: first_blood (battle win)');
    }
    
    // Check win streak for undefeated
    const currentWinStreak = user.battleStats?.currentWinStreak || 0;
    if (won && currentWinStreak >= 5 && !user.achievements?.includes('undefeated')) {
      newAchievements.push('undefeated');
      console.log('🎯 Unlocked: undefeated (5-win streak)');
    }
    
    // Total wins
    const totalWins = user.battleStats?.wins || 0;
    if (totalWins >= 20 && !user.achievements?.includes('battle_master')) {
      newAchievements.push('battle_master');
      console.log('🎯 Unlocked: battle_master (20 wins)');
    }
    
    // Perfect battle
    if (wasPerfect && !user.achievements?.includes('perfect_battle')) {
      newAchievements.push('perfect_battle');
      console.log('🎯 Unlocked: perfect_battle');
    }
    
    // Comeback
    if (wasComeback && !user.achievements?.includes('comeback_king')) {
      newAchievements.push('comeback_king');
      console.log('🎯 Unlocked: comeback_king');
    }
  }
  
  // Topic achievements
  if (user.topicScores?.mechanics >= 500 && !user.achievements?.includes('mechanics_expert')) {
    newAchievements.push('mechanics_expert');
    console.log('🎯 Unlocked: mechanics_expert');
  }
  
  if (user.topicScores?.electricity >= 500 && !user.achievements?.includes('electricity_expert')) {
    newAchievements.push('electricity_expert');
    console.log('🎯 Unlocked: electricity_expert');
  }
  
  if (user.topicScores?.optics >= 500 && !user.achievements?.includes('optics_expert')) {
    newAchievements.push('optics_expert');
    console.log('🎯 Unlocked: optics_expert');
  }
  
  if (user.topicScores?.thermodynamics >= 500 && !user.achievements?.includes('thermo_expert')) {
    newAchievements.push('thermo_expert');
    console.log('🎯 Unlocked: thermo_expert');
  }
  
  // Check if mastered all topics
  const masteredTopics = Object.values(user.topicScores || {}).filter(score => score >= 500).length;
  if (masteredTopics >= 4 && !user.achievements?.includes('jack_of_all')) {
    newAchievements.push('jack_of_all');
    console.log('🎯 Unlocked: jack_of_all (all topics mastered)');
  }
  
  // Skill achievements
  if (user.totalPoints >= 5000 && !user.achievements?.includes('point_millionaire')) {
    newAchievements.push('point_millionaire');
    console.log('🎯 Unlocked: point_millionaire');
  }
  
  if (user.gamesPlayed >= 100 && !user.achievements?.includes('marathon_runner')) {
    newAchievements.push('marathon_runner');
    console.log('🎯 Unlocked: marathon_runner');
  }
  
  console.log('New achievements to add:', newAchievements);
  return newAchievements;
};



const mockStorage = {
  data: {},
  async get(key) {
    const stored = localStorage.getItem(key);
    return stored ? { value: stored } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { value };
  },
  async list(prefix) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
    return { keys };
  }
};

const storage = typeof window.storage !== 'undefined' ? window.storage : mockStorage;

const avatars = ['🧑‍🔬', '👨‍🎓', '👩‍🚀', '🦸', '🧙', '🤖', '👽', '🦹‍♀️'];
const achievements = [
  // Original Achievements
  { id: 'first_win', name: 'First Victory', icon: '🎯', desc: 'Complete your first quiz', requirement: 1 },
  { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', desc: 'Answer 5 questions under 5s', requirement: 5 },
  { id: 'perfect_score', name: 'Perfect Score', icon: '💯', desc: 'Get 100% accuracy', requirement: 1 },
  { id: 'streak_master', name: 'Streak Master', icon: '🔥', desc: 'Achieve 10-question streak', requirement: 10 },
  { id: 'grandmaster', name: 'Grandmaster', icon: '👑', desc: 'Reach Grandmaster rank', requirement: 1000 },
  { id: 'quiz_veteran', name: 'Quiz Veteran', icon: '🎓', desc: 'Complete 50 quizzes', requirement: 50 },
  
  // ✅ NEW BATTLE ACHIEVEMENTS
  { id: 'first_blood', name: 'First Blood', icon: '🩸', desc: 'Win your first battle', requirement: 1 },
  { id: 'undefeated', name: 'Undefeated', icon: '🛡️', desc: 'Win 5 battles in a row', requirement: 5 },
  { id: 'battle_master', name: 'Battle Master', icon: '⚔️', desc: 'Win 20 total battles', requirement: 20 },
  { id: 'perfect_battle', name: 'Flawless Victory', icon: '🌟', desc: 'Win a battle with perfect score', requirement: 1 },
  { id: 'comeback_king', name: 'Comeback King', icon: '📈', desc: 'Win from behind (opponent had lead)', requirement: 1 },
  
  // ✅ NEW TOPIC ACHIEVEMENTS
  { id: 'mechanics_expert', name: 'Mechanics Expert', icon: '⚙️', desc: 'Score 500+ points in Mechanics', requirement: 500 },
  { id: 'electricity_expert', name: 'Electricity Expert', icon: '⚡', desc: 'Score 500+ points in Electricity', requirement: 500 },
  { id: 'optics_expert', name: 'Optics Expert', icon: '🔭', desc: 'Score 500+ points in Optics', requirement: 500 },
  { id: 'thermo_expert', name: 'Thermo Expert', icon: '🔥', desc: 'Score 500+ points in Thermodynamics', requirement: 500 },
  { id: 'jack_of_all', name: 'Jack of All Trades', icon: '🎭', desc: 'Master all 4 topics', requirement: 4 },
  
  // ✅ NEW SKILL ACHIEVEMENTS
  { id: 'lightning_fast', name: 'Lightning Fast', icon: '⚡', desc: 'Answer 10 questions in under 3s each', requirement: 10 },
  { id: 'accuracy_god', name: 'Accuracy God', icon: '🎯', desc: 'Maintain 90%+ accuracy over 10 quizzes', requirement: 90 },
  { id: 'point_millionaire', name: 'Point Millionaire', icon: '💰', desc: 'Reach 5000 total points', requirement: 5000 },
  { id: 'marathon_runner', name: 'Marathon Runner', icon: '🏃', desc: 'Complete 100 total quizzes', requirement: 100 },
  { id: 'power_user', name: 'Power User', icon: '🔋', desc: 'Use all power-ups in one game', requirement: 3 },
  
  // ✅ NEW SPECIAL ACHIEVEMENTS
  { id: 'early_bird', name: 'Early Bird', icon: '🐦', desc: 'Play 5 quizzes before 8 AM', requirement: 5 },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Play 5 quizzes after 10 PM', requirement: 5 },
  { id: 'weekend_warrior', name: 'Weekend Warrior', icon: '🎮', desc: 'Play 10 quizzes on weekend', requirement: 10 },
  { id: 'collection_complete', name: 'Collection Complete', icon: '🏆', desc: 'Unlock all achievements', requirement: 25 }
];

function App() {
  const [screen, setScreen] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [powerUps, setPowerUps] = useState({ timeFreeze: 1, fiftyFifty: 1, doublePoints: 1 });
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [removedOptions, setRemovedOptions] = useState([]);
  const [fastAnswers, setFastAnswers] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [expandedLaw, setExpandedLaw] = useState(null); // ← ADD THIS LINE HERE!

  // eslint-disable-next-line no-unused-vars
  const [userProgress, setUserProgress] = useState({
    mechanics: { easy: 0, medium: 0, hard: 0, total: 0 },
    electricity: { easy: 0, medium: 0, hard: 0, total: 0 },
    optics: { easy: 0, medium: 0, hard: 0, total: 0 },
    thermodynamics: { easy: 0, medium: 0, hard: 0, total: 0 }
  });
  const [showSolution, setShowSolution] = useState(false);
  
  // battle arena ---
  const [battleStep, setBattleStep] = useState('setup');

  // eslint-disable-next-line no-unused-vars
  const [selectedBattleTopic, setSelectedBattleTopic] = useState(null);
  const [opponentName, setOpponentName] = useState('');
  const [battleQuestions, setBattleQuestions] = useState([]);
  const [currentBattleQuestion, setCurrentBattleQuestion] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerTimes, setPlayerTimes] = useState([]);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(null);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [showBattleResults, setShowBattleResults] = useState(false);
    const [battleConfig, setBattleConfig] = useState({
    questionCount: 5,
    timePerQuestion: 30,
    questionTypes: {
      problemSolving: true,
      concepts: true,
      definitions: true
    },
    difficulty: 'mixed',
    topics: ['mechanics', 'electricity', 'optics', 'thermodynamics']
  });

  const [leaderboardType, setLeaderboardType] = useState('training'); // 'training' or 'battle'
  const [battleLeaderboard, setBattleLeaderboard] = useState([]);

  const [multiplayerMode, setMultiplayerMode] = useState(false); // 'none', 'local', 'online'
  const [player2Name, setPlayer2Name] = useState('');
  const [roomCode, setRoomCode] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [isHost, setIsHost] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [connectedPlayers, setConnectedPlayers] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [gameRoom, setGameRoom] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('p1'); // 'p1' or 'p2'
  const [player1Answers, setPlayer1Answers] = useState([]);
  const [player2Answers, setPlayer2Answers] = useState([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);


  const topics = [
    { id: 'mechanics', name: 'Mechanics', icon: '⚙️', color: 'from-blue-500 to-cyan-500', description: 'Motion, Forces & Energy' },
    { id: 'electricity', name: 'Electricity & Magnetism', icon: '⚡', color: 'from-yellow-500 to-orange-500', description: 'Charges, Circuits & Fields' },
    { id: 'optics', name: 'Optics', icon: '🔭', color: 'from-purple-500 to-pink-500', description: 'Light, Reflection & Refraction' },
    { id: 'thermodynamics', name: 'Thermodynamics', icon: '🔥', color: 'from-red-500 to-orange-500', description: 'Heat, Temperature & Entropy' }
  ];

  const allQuestions = {
  mechanics: [
    // Easy (difficulty : 1)
    { 
      q: "A 2kg object accelerates at 3m/s². What is the net force?", 
      options: ["4N", "6N", "8N", "10N"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "problem",
        given: [
          "Mass (m) = 2 kg",
          "Acceleration (a) = 3 m/s²"
        ],
        unknown: ["Net force (F) = ?"],
        formula: "F = ma (Newton's Second Law)",
        stepByStep: [
          "Apply Newton's Second Law: F = m × a",
          "Substitute values: F = 2 kg × 3 m/s²", 
          "Calculate: F = 6 N"
        ],
        conclusion: "The net force acting on the object is 6 Newtons.",
        explanation: "According to Newton's Second Law, force equals mass times acceleration. This fundamental relationship shows how much force is needed to accelerate a given mass."
      }
    },
    { 
      q: "What is the SI unit of momentum?", 
      options: ["kg⋅m/s", "N⋅s", "Both A and B", "J/s"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Momentum can be expressed in either kg⋅m/s or N⋅s because they are dimensionally equivalent. Since 1 N = 1 kg⋅m/s², then 1 N⋅s = 1 kg⋅m/s. Both units are correct for momentum."
      }
    },
    { 
      q: "The slope of a velocity-time graph represents:", 
      options: ["Distance", "Displacement", "Acceleration", "Speed"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept", 
        explanation: "The slope of a velocity-time graph represents acceleration. Slope is defined as change in y-axis (velocity) divided by change in x-axis (time), which equals acceleration (Δv/Δt)."
      }
    },
    { 
      q: "What is the SI unit of force?", 
      options: ["Joule", "Newton", "Watt", "Pascal"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The SI unit of force is Newton (N), named after Sir Isaac Newton. 1 Newton is defined as the force needed to accelerate 1 kg mass at 1 m/s²."
      }
    },
    { 
      q: "Which quantity is a vector?", 
      options: ["Speed", "Distance", "Time", "Velocity"], 
      correct: 3, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Velocity is a vector quantity because it has both magnitude (speed) and direction. Speed, distance, and time are scalar quantities that have only magnitude."
      }
    },
    { 
      q: "The rate of change of velocity is called:", 
      options: ["Speed", "Acceleration", "Distance", "Force"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Acceleration is defined as the rate of change of velocity with respect to time. It measures how quickly an object's velocity is changing, either in magnitude, direction, or both."
      }
    },
    { 
      q: "Mass is measured in:", 
      options: ["Newtons", "Kilograms", "Joules", "Meters"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Mass is measured in kilograms (kg) in the SI system. Newtons measure force, Joules measure energy, and Meters measure distance."
      }
    },
    { 
      q: "Newton's First Law is also called the law of:", 
      options: ["Action", "Gravity", "Inertia", "Motion"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Newton's First Law is called the law of inertia. It states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force."
      }
    },
    { 
      q: "Weight is a measure of:", 
      options: ["Mass", "Gravitational force", "Volume", "Density"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Weight is a measure of the gravitational force acting on an object. It depends on both the object's mass and the gravitational field strength (W = mg)."
      }
    },
    { 
      q: "The SI unit of work is:", 
      options: ["Newton", "Watt", "Joule", "Pascal"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The SI unit of work is Joule (J). Work is defined as force times distance (W = Fd), and 1 Joule = 1 Newton × 1 meter."
      }
    },
    { 
      q: "Friction always acts:", 
      options: ["Downward", "Upward", "Opposite to motion", "In direction of motion"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Friction always acts opposite to the direction of motion (or attempted motion). It opposes the relative motion between two surfaces in contact."
      }
    },
    { 
      q: "Power is the rate of doing:", 
      options: ["Force", "Work", "Energy", "Motion"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Power is defined as the rate of doing work or the rate of energy transfer. It measures how quickly work is done or energy is converted."
      }
    },
    { 
      q: "What is the SI unit of power?", 
      options: ["Joule", "Newton", "Watt", "Pascal"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The SI unit of power is Watt (W), named after James Watt. 1 Watt = 1 Joule per second, representing the rate of energy transfer."
      }
    },
    { 
      q: "Kinetic energy depends on:", 
      options: ["Position only", "Mass and velocity", "Height only", "Temperature"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Kinetic energy depends on both mass and velocity. The formula is KE = ½mv², showing that kinetic energy increases with both the object's mass and the square of its velocity."
      }
    },
    { 
      q: "Potential energy is energy due to:", 
      options: ["Motion", "Position", "Temperature", "Pressure"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Potential energy is energy due to an object's position or configuration. For gravitational potential energy, it depends on height (PE = mgh). For elastic potential energy, it depends on deformation."
      }
    },

    // Medium (difficulty: 2)
    { 
      q: "A ball is thrown upward. At its highest point, what is its acceleration?", 
      options: ["0 m/s²", "9.8 m/s² downward", "9.8 m/s² upward", "Depends on mass"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "At the highest point, the ball's acceleration is 9.8 m/s² downward. Gravity acts continuously throughout the motion, even when the vertical velocity is momentarily zero. The acceleration due to gravity is constant and independent of the object's mass or velocity."
      }
    },
    { 
      q: "If kinetic energy is doubled, velocity increases by a factor of:", 
      options: ["2", "√2", "4", "1/2"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "problem",
        given: [
          "Kinetic energy KE = ½mv²",
          "KE is doubled: KE₂ = 2 × KE₁"
        ],
        unknown: ["Factor by which velocity increases = ?"],
        formula: "KE ∝ v²",
        stepByStep: [
          "KE₁ = ½mv₁²",
          "KE₂ = ½mv₂² = 2 × KE₁",
          "½mv₂² = 2 × (½mv₁²)",
          "v₂² = 2v₁²", 
          "v₂ = √2 × v₁",
          "Velocity increases by factor of √2"
        ],
        conclusion: "Velocity increases by a factor of √2 when kinetic energy is doubled.",
        explanation: "Since kinetic energy is proportional to velocity squared (KE ∝ v²), doubling KE requires increasing velocity by √2."
      }
    },
    { 
      q: "Work done is zero when force and displacement are:", 
      options: ["Parallel", "Perpendicular", "At 45°", "Opposite"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Work done is zero when force and displacement are perpendicular (90°). In the work formula W = Fd cosθ, cos90° = 0, meaning no energy is transferred in the direction of motion when force acts at right angles to displacement."
      }
    },
    { 
      q: "A 5kg object moving at 10m/s has momentum of:", 
      options: ["2 kg⋅m/s", "15 kg⋅m/s", "50 kg⋅m/s", "500 kg⋅m/s"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "problem",
        given: [
          "Mass m = 5 kg", 
          "Velocity v = 10 m/s"
        ],
        unknown: ["Momentum p = ?"],
        formula: "p = m × v",
        stepByStep: [
          "Momentum = mass × velocity",
          "p = 5 kg × 10 m/s",
          "p = 50 kg⋅m/s"
        ],
        conclusion: "The momentum is 50 kg⋅m/s.",
        explanation: "Momentum represents the quantity of motion an object has and is directly proportional to both mass and velocity."
      }
    },
    { 
      q: "The centripetal force acts:", 
      options: ["Tangent to path", "Toward center", "Away from center", "Opposite to velocity"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "Centripetal force always acts toward the center of the circular path. The word 'centripetal' means 'center-seeking,' and this force is necessary to keep an object moving in a circular path by continuously changing its direction."
      }
    },
    { 
      q: "In uniform circular motion, which quantity is constant?", 
      options: ["Velocity", "Speed", "Acceleration", "Force"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "In uniform circular motion, speed remains constant while velocity changes continuously due to changing direction. Acceleration (centripetal) and force (centripetal) also remain constant in magnitude but change direction."
      }
    },
    { 
      q: "The impulse on an object equals its change in:", 
      options: ["Force", "Momentum", "Energy", "Position"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "Impulse equals the change in momentum of an object. This is known as the impulse-momentum theorem: J = Δp = FΔt. Impulse is the product of force and time, which causes a change in momentum."
      }
    },
    { 
      q: "Elastic collision conserves:", 
      options: ["Momentum only", "KE only", "Both momentum and KE", "Neither"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "In an elastic collision, both momentum and kinetic energy are conserved. Objects bounce off each other without permanent deformation or generation of heat. This is an ideal case where no energy is lost to other forms."
      }
    },
    { 
      q: "The gravitational force between two masses is:", 
      options: ["Directly proportional to distance", "Inversely proportional to distance", "Inversely proportional to distance²", "Independent of distance"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "The gravitational force between two masses is inversely proportional to the square of the distance between them (F ∝ 1/r²). This is Newton's Law of Universal Gravitation, which states that gravity weakens with the square of the distance."
      }
    },
    { 
      q: "A satellite in orbit experiences:", 
      options: ["No gravity", "Free fall", "Zero velocity", "Constant potential energy"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "A satellite in orbit experiences free fall. It's continuously falling toward Earth but moving forward fast enough that it keeps missing the planet. This creates the sensation of weightlessness while gravity is still acting on it."
      }
    },
    { 
      q: "The mechanical advantage of a machine is the ratio of:", 
      options: ["Input force to output force", "Output force to input force", "Work input to work output", "Power input to power output"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "Mechanical advantage is the ratio of output force to input force (MA = F_out/F_in). It measures how much a machine multiplies the input force. A higher mechanical advantage means less input force is needed for the same output force."
      }
    },
    { 
      q: "Rolling friction is generally:", 
      options: ["Greater than sliding friction", "Less than sliding friction", "Equal to sliding friction", "Zero"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Rolling friction is generally less than sliding friction. This is because in rolling motion, there's minimal relative motion at the point of contact, while sliding involves continuous rubbing of surfaces against each other, creating more resistance."
      }
    },
    { 
      q: "For a projectile, the horizontal component of velocity:", 
      options: ["Increases", "Decreases", "Remains constant", "Becomes zero"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "For a projectile, the horizontal component of velocity remains constant (assuming no air resistance). Gravity only affects the vertical component, so the horizontal motion continues at the same speed throughout the trajectory."
      }
    },
    { 
      q: "The period of a simple pendulum depends on:", 
      options: ["Mass", "Length", "Amplitude", "Material"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "The period of a simple pendulum depends primarily on its length (T = 2π√(L/g)). For small angles, the period is independent of mass and amplitude. Longer pendulums have longer periods, while gravity affects all pendulums equally at a given location."
      }
    },
    { 
      q: "In an inelastic collision:", 
      options: ["KE is conserved", "Momentum is not conserved", "Both KE and momentum conserved", "Momentum is conserved"], 
      correct: 3, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "In an inelastic collision, momentum is conserved but kinetic energy is not conserved. Some kinetic energy is converted to other forms like heat, sound, or deformation energy. Perfectly inelastic collisions occur when objects stick together after impact."
      }
    },

    // Hard (difficulty: 3)
    { 
      q: "A pendulum on the Moon (g = 1.6 m/s²) compared to Earth will:", 
      options: ["Swing faster", "Swing slower", "Same period", "Not swing"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "problem",
        given: [
          "Moon gravity: g_moon = 1.6 m/s²",
          "Earth gravity: g_earth = 9.8 m/s²",
          "Pendulum period formula: T = 2π√(L/g)"
        ],
        unknown: ["How pendulum period changes on Moon?"],
        formula: "T = 2π√(L/g)",
        stepByStep: [
          "Period T ∝ 1/√g (since 2π and L are constant)",
          "g_moon < g_earth (1.6 < 9.8)",
          "Therefore, T_moon > T_earth",
          "Longer period means slower swinging frequency",
          "Pendulum swings slower on Moon"
        ],
        conclusion: "The pendulum will swing slower on the Moon compared to Earth.",
        explanation: "With weaker gravity on the Moon, the restoring force is smaller, resulting in a longer period and slower oscillations."
      }
    },
    { 
      q: "Conservation of momentum applies when:", 
      options: ["External force is zero", "Internal force is zero", "Total energy is constant", "Acceleration is zero"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Momentum is conserved when the net external force is zero. Internal forces between objects in a system cancel out due to Newton's Third Law, but external forces can change the total momentum of the system."
      }
    },
    { 
      q: "A 1000kg car traveling at 20m/s. What force stops it in 5s?", 
      options: ["2000N", "4000N", "5000N", "10000N"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "problem",
        given: [
          "Mass m = 1000 kg",
          "Initial velocity u = 20 m/s", 
          "Final velocity v = 0 m/s",
          "Time t = 5 s"
        ],
        unknown: ["Stopping force F = ?"],
        formula: "F = ma, a = (v-u)/t",
        stepByStep: [
          "First find acceleration: a = (v-u)/t = (0-20)/5 = -4 m/s²",
          "Magnitude of acceleration = 4 m/s²",
          "Now find force: F = m × a = 1000 × 4 = 4000 N"
        ],
        conclusion: "The stopping force required is 4000 Newtons.",
        explanation: "The negative acceleration indicates deceleration. The force magnitude shows how much force is needed to stop the car in the given time."
      }
    },
    { 
      q: "The escape velocity from Earth is approximately:", 
      options: ["7.9 km/s", "11.2 km/s", "15 km/s", "25 km/s"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The escape velocity from Earth is approximately 11.2 km/s. This is the minimum speed needed for an object to break free from Earth's gravitational pull without further propulsion. Orbital velocity is about 7.9 km/s."
      }
    },
    { 
      q: "In a completely inelastic collision between equal masses, the final velocity is:", 
      options: ["Zero", "Half the initial", "Same as initial", "Double the initial"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "problem",
        given: [
          "Completely inelastic collision",
          "Equal masses m₁ = m₂ = m",
          "One object initially at rest: u₂ = 0"
        ],
        unknown: ["Final velocity v_f = ?"],
        formula: "m₁u₁ + m₂u₂ = (m₁+m₂)v_f",
        stepByStep: [
          "Let u₁ = initial velocity of moving object",
          "Conservation of momentum: m×u₁ + m×0 = (m+m)×v_f",
          "m×u₁ = 2m×v_f",
          "v_f = u₁/2"
        ],
        conclusion: "The final velocity is half the initial velocity of the moving object.",
        explanation: "In completely inelastic collisions, objects stick together. With equal masses, momentum conservation requires the final velocity to be half the initial velocity."
      }
    },
    { 
      q: "The coefficient of restitution for a perfectly elastic collision is:", 
      options: ["0", "0.5", "1", "2"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "The coefficient of restitution (e) for a perfectly elastic collision is 1. This means relative velocity after collision equals relative velocity before collision. e=0 for perfectly inelastic, 0<e<1 for partially elastic collisions."
      }
    },
    { 
      q: "A simple harmonic oscillator's total energy is proportional to:", 
      options: ["Amplitude", "Amplitude²", "Frequency", "Mass"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "A simple harmonic oscillator's total energy is proportional to the square of the amplitude (E ∝ A²). The energy formula is E = ½kA², where k is the spring constant, showing quadratic dependence on amplitude."
      }
    },
    { 
      q: "The angular momentum of a particle is conserved when:", 
      options: ["Net force is zero", "Net torque is zero", "Velocity is constant", "Acceleration is zero"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Angular momentum is conserved when the net torque is zero. This is the rotational analog of linear momentum conservation when net force is zero. Torque causes changes in angular momentum, just as force causes changes in linear momentum."
      }
    },
    { 
      q: "For a rolling object without slipping, v = rω. What is ω?", 
      options: ["Linear velocity", "Angular velocity", "Acceleration", "Torque"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "In the rolling without slipping condition v = rω, ω represents angular velocity. It's measured in radians per second and relates to how fast the object is rotating about its axis."
      }
    },
    { 
      q: "The moment of inertia depends on:", 
      options: ["Mass only", "Mass distribution", "Velocity", "Force"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The moment of inertia depends on both mass and mass distribution relative to the axis of rotation. It's the rotational analog of mass and measures resistance to angular acceleration. Objects with mass farther from axis have larger moment of inertia."
      }
    },
    { 
      q: "Kepler's third law relates period to:", 
      options: ["Mass", "Velocity", "Orbital radius", "Energy"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Kepler's third law relates the orbital period squared to the orbital radius cubed (T² ∝ r³). For planets around the Sun, the square of the orbital period is proportional to the cube of the semi-major axis of the orbit."
      }
    },
    { 
      q: "For a non-uniform circular motion, total acceleration has:", 
      options: ["Only centripetal component", "Only tangential component", "Both centripetal and tangential", "Zero acceleration"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "In non-uniform circular motion, total acceleration has both centripetal and tangential components. Centripetal acceleration changes direction, tangential acceleration changes speed. Only uniform circular motion has purely centripetal acceleration."
      }
    },
    { 
      q: "The power delivered by a force F on object with velocity v is:", 
      options: ["F + v", "F - v", "F × v", "F • v"], 
      correct: 3, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "The power delivered by a force F on an object with velocity v is the dot product F • v. This gives P = Fv cosθ, where θ is the angle between force and velocity vectors. Only the component of force in the direction of motion does work."
      }
    },
    { 
      q: "A flywheel's rotational kinetic energy is:", 
      options: ["½mv²", "½Iω²", "mgh", "½kx²"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "A flywheel's rotational kinetic energy is ½Iω², where I is moment of inertia and ω is angular velocity. This is the rotational analog of translational kinetic energy ½mv²."
      }
    },
    { 
      q: "The time period of a conical pendulum depends on:", 
      options: ["Length and angle", "Mass and length", "Angle only", "Mass only"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The time period of a conical pendulum depends on the length of the string and the angle it makes with the vertical. The formula is T = 2π√(L cosθ/g), showing dependence on both length (L) and angle (θ), but not on mass."
      }
    }
  ],

  electricity: [
    // Easy (difficulty: 1)
    { 
      q: "What is the unit of electrical resistance?", 
      options: ["Ampere", "Volt", "Ohm", "Watt"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The unit of electrical resistance is Ohm (Ω), named after Georg Simon Ohm. Resistance measures how much a material opposes the flow of electric current."
      }
    },
    { 
      q: "A 12V battery powers a 3Ω resistor. What is the current?", 
      options: ["2A", "4A", "6A", "8A"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "problem",
        given: [
          "Voltage V = 12 V",
          "Resistance R = 3 Ω"
        ],
        unknown: ["Current I = ?"],
        formula: "I = V/R (Ohm's Law)",
        stepByStep: [
          "Apply Ohm's Law: I = V ÷ R",
          "Substitute values: I = 12 V ÷ 3 Ω",
          "Calculate: I = 4 A"
        ],
        conclusion: "The current flowing through the circuit is 4 Amperes.",
        explanation: "Ohm's Law states that current is directly proportional to voltage and inversely proportional to resistance."
      }
    },
    { 
      q: "The SI unit of electric charge is:", 
      options: ["Volt", "Ampere", "Coulomb", "Ohm"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The SI unit of electric charge is Coulomb (C). One Coulomb is defined as the charge transferred by a steady current of one Ampere in one second."
      }
    },
    { 
      q: "Electric current is the flow of:", 
      options: ["Protons", "Neutrons", "Electrons", "Atoms"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Electric current is the flow of electrons in metallic conductors. Electrons are the mobile charge carriers that move when voltage is applied, creating current flow."
      }
    },
    { 
      q: "The SI unit of electric current is:", 
      options: ["Coulomb", "Ampere", "Volt", "Watt"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The SI unit of electric current is Ampere (A). It's a base SI unit defined as the flow of one Coulomb of charge per second through a conductor."
      }
    },
    { 
      q: "Ohm's law states V =:", 
      options: ["I/R", "IR", "I+R", "R/I"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Ohm's Law states V = IR, where V is voltage, I is current, and R is resistance. This fundamental relationship shows that voltage equals current times resistance."
      }
    },
    { 
      q: "A conductor allows:", 
      options: ["No current flow", "Easy current flow", "Only heat flow", "Light flow"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "A conductor allows easy current flow. Materials like copper, silver, and aluminum have many free electrons that can move easily when voltage is applied."
      }
    },
    { 
      q: "An insulator:", 
      options: ["Conducts easily", "Resists current flow", "Has zero resistance", "Has infinite voltage"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "An insulator resists current flow. Materials like rubber, glass, and plastic have very few free electrons and high resistance, making them poor conductors of electricity."
      }
    },
    { 
      q: "Electric potential is measured in:", 
      options: ["Amperes", "Volts", "Ohms", "Watts"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Electric potential (voltage) is measured in Volts (V). It represents the electrical potential energy per unit charge and is the 'push' that drives current through a circuit."
      }
    },
    { 
      q: "Power in an electrical circuit is measured in:", 
      options: ["Joules", "Watts", "Volts", "Amperes"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Power in an electrical circuit is measured in Watts (W). Electrical power is calculated as P = VI (voltage times current) and represents the rate of energy consumption."
      }
    },
    { 
      q: "The symbol for resistor in a circuit is:", 
      options: ["Straight line", "Zigzag line", "Circle", "Battery symbol"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The symbol for a resistor in a circuit is a zigzag line. This standardized symbol represents a component that limits or controls the flow of electric current."
      }
    },
    { 
      q: "Like charges:", 
      options: ["Attract", "Repel", "Neutralize", "Have no effect"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Like charges repel each other. This is a fundamental principle of electrostatics: positive charges repel other positive charges, and negative charges repel other negative charges."
      }
    },
    { 
      q: "The device that stores electrical charge is:", 
      options: ["Resistor", "Capacitor", "Inductor", "Transformer"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "The device that stores electrical charge is a capacitor. Capacitors store energy in an electric field between two conductive plates separated by an insulator."
      }
    },
    { 
      q: "A fuse is used to:", 
      options: ["Increase current", "Protect circuit", "Store energy", "Generate voltage"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "A fuse is used to protect a circuit from excessive current. It contains a metal wire that melts and breaks the circuit when current exceeds a safe level, preventing damage to other components."
      }
    },
    { 
      q: "Electric field lines point:", 
      options: ["From negative to positive", "From positive to negative", "In circles", "Randomly"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Electric field lines point from positive to negative charges. This convention shows the direction a positive test charge would move if placed in the field."
      }
    },

    // Medium (difficulty: 2)
    { 
      q: "In a series circuit, which quantity remains constant?", 
      options: ["Voltage", "Current", "Resistance", "Power"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "In a series circuit, current remains constant throughout all components. The same current flows through each resistor, while voltage divides across them according to their resistances."
      }
    },
    { 
      q: "Magnetic field lines always form:", 
      options: ["Straight lines", "Closed loops", "Spirals", "Random patterns"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Magnetic field lines always form closed loops. They emerge from the North pole and enter the South pole, creating continuous loops without beginning or end, unlike electric field lines which start and end on charges."
      }
    },
    { 
      q: "Kirchhoff's current law is based on conservation of:", 
      options: ["Energy", "Charge", "Momentum", "Power"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Kirchhoff's current law is based on conservation of charge. It states that the algebraic sum of currents entering a junction equals zero, meaning charge cannot accumulate at any point in a circuit."
      }
    },
    { 
      q: "In a parallel circuit, voltage across each branch is:", 
      options: ["Different", "Same", "Zero", "Infinite"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "In a parallel circuit, voltage across each branch is the same. All components are connected directly across the voltage source, so they experience identical potential differences while current divides among branches."
      }
    },
    { 
      q: "The equivalent resistance of resistors in series is:", 
      options: ["Sum of all resistances", "Product divided by sum", "Always less than smallest", "Average of resistances"], 
      correct: 0, 
      difficulty: 2,
      solution: {
        type: "problem",
        given: [
          "Resistors connected in series",
          "Current same through all resistors"
        ],
        unknown: ["Equivalent resistance R_eq = ?"],
        formula: "R_eq = R₁ + R₂ + R₃ + ...",
        stepByStep: [
          "In series, same current flows through all resistors",
          "Total voltage V = V₁ + V₂ + V₃ + ...",
          "Using Ohm's Law: V = IR₁ + IR₂ + IR₃ + ...",
          "V = I(R₁ + R₂ + R₃ + ...)",
          "Therefore R_eq = R₁ + R₂ + R₃ + ..."
        ],
        conclusion: "The equivalent resistance of series resistors is the sum of individual resistances.",
        explanation: "Series resistance adds up because current must flow through each resistor sequentially, experiencing the combined opposition of all."
      }
    },
    { 
      q: "For resistors in parallel, the equivalent resistance is:", 
      options: ["Sum of resistances", "Always greater than largest", "Always less than smallest", "Average"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "problem",
        given: [
          "Resistors connected in parallel",
          "Voltage same across all resistors"
        ],
        unknown: ["Equivalent resistance R_eq = ?"],
        formula: "1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ + ...",
        stepByStep: [
          "In parallel, same voltage across all resistors",
          "Total current I = I₁ + I₂ + I₃ + ...",
          "Using Ohm's Law: I = V/R₁ + V/R₂ + V/R₃ + ...",
          "I = V(1/R₁ + 1/R₂ + 1/R₃ + ...)",
          "Therefore 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ + ..."
        ],
        conclusion: "The equivalent resistance of parallel resistors is always less than the smallest individual resistance.",
        explanation: "Parallel paths provide multiple routes for current, reducing overall resistance compared to any single path."
      }
    },
    { 
      q: "Electric field inside a conductor is:", 
      options: ["Maximum", "Minimum", "Zero", "Variable"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "The electric field inside a conductor is zero under electrostatic conditions. Free electrons redistribute themselves to cancel any internal field, creating an equipotential volume."
      }
    },
    { 
      q: "Capacitance is measured in:", 
      options: ["Farads", "Henrys", "Ohms", "Volts"], 
      correct: 0, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Capacitance is measured in Farads (F), named after Michael Faraday. One Farad is defined as one Coulomb per Volt, representing the ability to store charge per unit voltage."
      }
    },
    { 
      q: "A capacitor stores energy in:", 
      options: ["Magnetic field", "Electric field", "Heat", "Light"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "A capacitor stores energy in an electric field between its plates. The energy formula is E = ½CV², representing work done to separate charges and establish the electric field."
      }
    },
    { 
      q: "The force between two charges is given by:", 
      options: ["Newton's law", "Coulomb's law", "Ohm's law", "Faraday's law"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "The force between two charges is given by Coulomb's law: F = kq₁q₂/r², where k is Coulomb's constant. This describes the electrostatic force between point charges."
      }
    },
    { 
      q: "EMF stands for:", 
      options: ["Electric Motor Force", "Electromotive Force", "Electromagnetic Field", "Electric Magnetic Force"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "EMF stands for Electromotive Force. It's the voltage generated by sources like batteries and generators, representing the energy supplied per unit charge to drive current through a circuit."
      }
    },
    { 
      q: "An ammeter is connected in:", 
      options: ["Series", "Parallel", "Either way", "Not connected"], 
      correct: 0, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "An ammeter is connected in series with the circuit component. This allows it to measure the current flowing through that branch without significantly altering the circuit's operation."
      }
    },
    { 
      q: "A voltmeter is connected in:", 
      options: ["Series", "Parallel", "Either way", "Not connected"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "A voltmeter is connected in parallel with the circuit component. This allows it to measure the potential difference across that component without drawing significant current."
      }
    },
    { 
      q: "Fleming's left-hand rule is used for:", 
      options: ["Generator", "Motor", "Transformer", "Capacitor"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Fleming's left-hand rule is used for motors. It gives the direction of force on a current-carrying conductor in a magnetic field: Thumb = Force, First finger = Field, Second finger = Current."
      }
    },
    { 
      q: "Lenz's law is a consequence of:", 
      options: ["Energy conservation", "Charge conservation", "Mass conservation", "Momentum conservation"], 
      correct: 0, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Lenz's law is a consequence of energy conservation. The induced current always opposes the change causing it, preventing the creation of energy from nothing and ensuring conservation."
      }
    },

    // Hard (difficulty: 3)
    { 
      q: "In an LC circuit, energy oscillates between:", 
      options: ["Kinetic and potential", "Electric and magnetic", "Heat and light", "Current and voltage"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "In an LC circuit, energy oscillates between electric field in the capacitor and magnetic field in the inductor. This creates continuous oscillations at the resonant frequency without energy loss in ideal conditions."
      }
    },
    { 
      q: "A transformer works on the principle of:", 
      options: ["Self-induction", "Mutual induction", "Electromagnetic waves", "Electrostatics"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "A transformer works on the principle of mutual induction. Changing current in the primary coil induces voltage in the secondary coil through their shared magnetic field, allowing voltage transformation."
      }
    },
    { 
      q: "The time constant of an RC circuit is:", 
      options: ["R/C", "RC", "C/R", "R+C"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "The time constant of an RC circuit is RC (resistance times capacitance). It represents the time for capacitor voltage to reach 63.2% of final value during charging or 36.8% during discharging."
      }
    },
    { 
      q: "In an AC circuit, the power factor is:", 
      options: ["Always 1", "cos φ", "sin φ", "tan φ"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "In an AC circuit, the power factor is cos φ, where φ is the phase angle between voltage and current. It represents the fraction of apparent power that does useful work."
      }
    },
    { 
      q: "The reactance of a capacitor at frequency f is:", 
      options: ["2πfC", "1/(2πfC)", "2πfL", "1/(2πfL)"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "problem",
        given: [
          "Capacitor in AC circuit",
          "Frequency = f",
          "Capacitance = C"
        ],
        unknown: ["Capacitive reactance X_C = ?"],
        formula: "X_C = 1/(2πfC)",
        stepByStep: [
          "Capacitive reactance opposes AC current flow",
          "X_C = 1/(ωC) where ω = 2πf",
          "Therefore X_C = 1/(2πfC)",
          "Higher frequency or capacitance gives lower reactance"
        ],
        conclusion: "The capacitive reactance is X_C = 1/(2πfC).",
        explanation: "Capacitors block DC but pass AC, with opposition decreasing as frequency increases due to less time for charge buildup."
      }
    },
    { 
      q: "The resonant frequency of LC circuit is proportional to:", 
      options: ["LC", "L/C", "1/√LC", "√LC"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "problem",
        given: [
          "LC circuit with inductance L and capacitance C",
          "Resonant frequency formula"
        ],
        unknown: ["How resonant frequency relates to L and C?"],
        formula: "f = 1/(2π√LC)",
        stepByStep: [
          "Resonant frequency f = 1/(2π√LC)",
          "This shows f ∝ 1/√LC",
          "Doubling L or C reduces frequency by √2",
          "Maximum energy transfer occurs at resonance"
        ],
        conclusion: "The resonant frequency is proportional to 1/√LC.",
        explanation: "At resonance, inductive and capacitive reactances cancel, allowing maximum current flow. The frequency depends inversely on the square root of the LC product."
      }
    },
    { 
      q: "In a step-up transformer:", 
      options: ["Ns < Np", "Ns = Np", "Ns > Np", "No relation"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "In a step-up transformer, the secondary turns (Ns) are greater than primary turns (Np). This increases voltage according to V_s/V_p = N_s/N_p while decreasing current to conserve power."
      }
    },
    { 
      q: "Eddy currents can be reduced by:", 
      options: ["Using laminations", "Increasing current", "Using solid core", "Decreasing resistance"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Eddy currents can be reduced by using laminations. Thin insulated sheets oriented parallel to magnetic flux reduce circulating currents, minimizing energy losses in transformers and motors."
      }
    },
    { 
      q: "The magnetic field at the center of a circular coil is:", 
      options: ["Proportional to radius", "Inversely proportional to radius", "Independent of radius", "Proportional to radius²"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The magnetic field at the center of a circular coil is inversely proportional to radius. Larger coils with the same current produce weaker fields at their centers due to greater distance from the current elements."
      }
    },
    { 
      q: "Hall effect is used to measure:", 
      options: ["Voltage", "Current", "Magnetic field", "Resistance"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Hall effect is used to measure magnetic field strength. When current flows through a conductor in a magnetic field, a transverse voltage develops proportional to the field strength, allowing precise magnetic measurements."
      }
    },
    { 
      q: "The quality factor Q of an LCR circuit is:", 
      options: ["ωL/R", "R/ωL", "ωC/R", "R/ωC"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "The quality factor Q of an LCR circuit is ωL/R. It represents the sharpness of resonance - higher Q means narrower bandwidth and more selective frequency response."
      }
    },
    { 
      q: "Self-inductance of a coil depends on:", 
      options: ["Current only", "Number of turns²", "Voltage", "Power"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Self-inductance of a coil depends on the square of the number of turns (N²). More turns increase magnetic flux linkage, enhancing the coil's ability to oppose changes in current."
      }
    },
    { 
      q: "The direction of induced EMF is given by:", 
      options: ["Fleming's left hand rule", "Lenz's law", "Right hand thumb rule", "Coulomb's law"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The direction of induced EMF is given by Lenz's law: the induced current flows in a direction that opposes the change in magnetic flux that produced it, ensuring energy conservation."
      }
    },
    { 
      q: "In an LR circuit, the time constant is:", 
      options: ["L/R", "R/L", "LR", "L+R"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "In an LR circuit, the time constant is L/R. It represents the time for current to reach 63.2% of final value when voltage is applied, characterizing the inductor's response time."
      }
    },
    { 
      q: "Displacement current was introduced by:", 
      options: ["Faraday", "Ampere", "Maxwell", "Coulomb"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Displacement current was introduced by James Clerk Maxwell. He added this concept to Ampere's law to account for changing electric fields, completing the theory of electromagnetism and predicting electromagnetic waves."
      }
    }
  ],

  optics: [
    // Easy (difficulty: 1)
    { 
      q: "The speed of light in vacuum is approximately:", 
      options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10¹² m/s"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The speed of light in vacuum is approximately 3×10⁸ m/s (299,792,458 m/s exactly). This universal constant 'c' is the maximum speed at which information can travel in the universe."
      }
    },
    { 
      q: "The bending of light when it passes from one medium to another is called:", 
      options: ["Reflection", "Refraction", "Diffraction", "Dispersion"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "The bending of light when it passes from one medium to another is called refraction. This occurs due to the change in light's speed as it enters a different medium with different optical density."
      }
    },
    { 
      q: "A plane mirror always forms an image that is:", 
      options: ["Real", "Virtual", "Inverted", "Magnified"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "A plane mirror always forms a virtual image. The image appears behind the mirror, cannot be projected on a screen, and is upright, same-sized, and laterally inverted."
      }
    },
    { 
      q: "The SI unit of luminous intensity is:", 
      options: ["Lumen", "Candela", "Lux", "Watt"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The SI unit of luminous intensity is Candela (cd). It measures the power of light emitted in a particular direction, weighted by the sensitivity of the human eye to different wavelengths."
      }
    },
    { 
      q: "Which color has the shortest wavelength?", 
      options: ["Red", "Green", "Blue", "Violet"], 
      correct: 3, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Violet light has the shortest wavelength in the visible spectrum (about 400 nm). Red has the longest wavelength (about 700 nm), with other colors arranged in between in ROYGBIV order."
      }
    },
    { 
      q: "A convex lens is also called:", 
      options: ["Diverging lens", "Converging lens", "Plane lens", "Cylindrical lens"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "A convex lens is also called a converging lens. It bends parallel light rays inward to meet at a focal point, making it useful for focusing light and forming real images."
      }
    },
    { 
      q: "The point where light rays meet after reflection/refraction is called:", 
      options: ["Center", "Pole", "Focus", "Vertex"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "The point where light rays meet after reflection or refraction is called the focus. For converging systems, parallel rays converge at the focal point."
      }
    },
    { 
      q: "White light is composed of:", 
      options: ["One color", "Two colors", "Three colors", "Seven colors"], 
      correct: 3, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "White light is composed of seven colors: red, orange, yellow, green, blue, indigo, and violet (ROYGBIV). This spectrum becomes visible when white light is dispersed by a prism."
      }
    },
    { 
      q: "The splitting of white light into colors is called:", 
      options: ["Reflection", "Refraction", "Dispersion", "Diffraction"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "The splitting of white light into colors is called dispersion. This occurs because different wavelengths (colors) refract at slightly different angles when passing through a medium like glass."
      }
    },
    { 
      q: "A concave mirror can form:", 
      options: ["Only virtual images", "Only real images", "Both real and virtual", "No images"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "A concave mirror can form both real and virtual images depending on object position. Real images form when object is beyond focus, virtual images when object is between focus and mirror."
      }
    },
    { 
      q: "The refractive index of a medium is always:", 
      options: ["Less than 1", "Equal to 1", "Greater than or equal to 1", "Zero"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The refractive index of a medium is always greater than or equal to 1. It's defined as n = c/v, where c is vacuum light speed and v is speed in medium, so n ≥ 1 always."
      }
    },
    { 
      q: "Rainbow is formed due to:", 
      options: ["Reflection only", "Refraction only", "Refraction and dispersion", "Diffraction"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Rainbow is formed due to refraction and dispersion of sunlight in water droplets. Light enters droplets, reflects internally, then exits refracted and dispersed into colors."
      }
    },
    { 
      q: "The image formed by a plane mirror is:", 
      options: ["Laterally inverted", "Vertically inverted", "Rotated", "Magnified"], 
      correct: 0, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The image formed by a plane mirror is laterally inverted (left-right reversed). Your right hand appears as left hand in the mirror, while vertical orientation remains unchanged."
      }
    },
    { 
      q: "Fiber optics works on the principle of:", 
      options: ["Reflection", "Refraction", "Total internal reflection", "Dispersion"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Fiber optics works on the principle of total internal reflection. Light undergoes repeated total internal reflections inside the optical fiber core, allowing efficient transmission over long distances."
      }
    },
    { 
      q: "The focal length of a plane mirror is:", 
      options: ["Zero", "Infinite", "Negative", "Positive"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The focal length of a plane mirror is infinite. Parallel rays remain parallel after reflection, so the focal point is at infinity, making it neither converging nor diverging."
      }
    }
  ],

  thermodynamics: [
    // Easy (difficulty: 1)
    { 
      q: "At absolute zero temperature, the value is:", 
      options: ["0°C", "-273.15°C", "-100°C", "-373°C"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Absolute zero is -273.15°C or 0 Kelvin. This is the theoretical lowest possible temperature where molecular motion essentially stops."
      }
    },
    { 
      q: "The first law of thermodynamics is based on conservation of:", 
      options: ["Mass", "Energy", "Momentum", "Entropy"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The first law of thermodynamics is based on conservation of energy. It states that energy cannot be created or destroyed, only converted from one form to another."
      }
    },
    { 
      q: "The SI unit of temperature is:", 
      options: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The SI unit of temperature is Kelvin (K). It is an absolute temperature scale where 0 K represents absolute zero."
      }
    },
    { 
      q: "Heat flows from:", 
      options: ["Cold to hot", "Hot to cold", "Equal temperature bodies", "Does not flow"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Heat flows spontaneously from hot to cold objects. This is a fundamental principle of thermodynamics and occurs until thermal equilibrium is reached."
      }
    },
    { 
      q: "Thermal expansion occurs due to:", 
      options: ["Cooling", "Heating", "Pressure", "Magnetic field"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Thermal expansion occurs due to heating. As temperature increases, molecules vibrate more vigorously and occupy more space, causing materials to expand."
      }
    },
    { 
      q: "The zeroth law of thermodynamics deals with:", 
      options: ["Energy", "Entropy", "Thermal equilibrium", "Work"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "The zeroth law of thermodynamics deals with thermal equilibrium. It states that if two systems are each in thermal equilibrium with a third, they are in thermal equilibrium with each other."
      }
    },
    { 
      q: "Specific heat capacity is measured in:", 
      options: ["J/K", "J/kg⋅K", "J/kg", "K/kg"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Specific heat capacity is measured in J/kg⋅K. It represents the amount of heat required to raise the temperature of 1 kg of a substance by 1 Kelvin."
      }
    },
    { 
      q: "Conduction is heat transfer through:", 
      options: ["Electromagnetic waves", "Material movement", "Direct contact", "Vacuum"], 
      correct: 2, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Conduction is heat transfer through direct contact between particles. It occurs primarily in solids where molecules transfer kinetic energy to adjacent molecules."
      }
    },
    { 
      q: "Convection occurs in:", 
      options: ["Solids only", "Fluids only", "Vacuum", "Metals only"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Convection occurs in fluids only (liquids and gases). It involves heat transfer through the actual movement of the fluid itself."
      }
    },
    { 
      q: "Radiation does not require:", 
      options: ["Temperature difference", "Medium", "Energy", "Heat source"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Radiation does not require a medium. It can travel through vacuum via electromagnetic waves, unlike conduction and convection which require material mediums."
      }
    },
    { 
      q: "The process where no heat is exchanged is called:", 
      options: ["Isothermal", "Isobaric", "Isochoric", "Adiabatic"], 
      correct: 3, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "A process where no heat is exchanged is called adiabatic. The system is perfectly insulated, so Q = 0, and any temperature change results from work done."
      }
    },
    { 
      q: "Latent heat is the heat required to change:", 
      options: ["Temperature", "State", "Pressure", "Volume"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "definition",
        explanation: "Latent heat is the heat required to change state (phase) without changing temperature. Examples include melting (fusion) and vaporization."
      }
    },
    { 
      q: "Good conductors of heat are usually:", 
      options: ["Insulators", "Metals", "Gases", "Liquids"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Good conductors of heat are usually metals. They have free electrons that can efficiently transfer thermal energy through the material."
      }
    },
    { 
      q: "Temperature is a measure of:", 
      options: ["Total heat", "Average kinetic energy", "Potential energy", "Total energy"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "Temperature is a measure of average kinetic energy of molecules. Higher temperature means molecules are moving faster on average."
      }
    },
    { 
      q: "A thermometer measures:", 
      options: ["Heat", "Temperature", "Energy", "Entropy"], 
      correct: 1, 
      difficulty: 1,
      solution: {
        type: "concept",
        explanation: "A thermometer measures temperature. It does not measure total heat content, but rather the thermal state that determines heat flow direction."
      }
    },

    // Medium (difficulty: 2)
    { 
      q: "In an adiabatic process, what remains constant?", 
      options: ["Temperature", "Pressure", "Volume", "No heat exchange"], 
      correct: 3, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "In an adiabatic process, no heat exchange occurs (Q = 0). The system is thermally insulated, so all energy transfer happens through work."
      }
    },
    { 
      q: "Entropy of the universe always:", 
      options: ["Decreases", "Increases", "Remains constant", "Becomes zero"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Entropy of the universe always increases according to the second law of thermodynamics. This represents the tendency toward disorder and energy dispersal."
      }
    },
    { 
      q: "In an isothermal process for an ideal gas:", 
      options: ["ΔU = 0", "ΔH = 0", "ΔS = 0", "ΔT ≠ 0"], 
      correct: 0, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "In an isothermal process for an ideal gas, ΔU = 0. Since internal energy depends only on temperature, constant temperature means constant internal energy."
      }
    },
    { 
      q: "Heat capacity at constant pressure is:", 
      options: ["Less than Cv", "Equal to Cv", "Greater than Cv", "Zero"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Heat capacity at constant pressure (Cp) is greater than Cv because at constant pressure, some heat is used to do expansion work against external pressure."
      }
    },
    { 
      q: "The ideal gas equation is:", 
      options: ["PV = RT", "PV = nRT", "P/V = nRT", "PV = T"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "The ideal gas equation is PV = nRT, where P is pressure, V is volume, n is number of moles, R is gas constant, and T is temperature in Kelvin."
      }
    },
    { 
      q: "In an isochoric process:", 
      options: ["Volume constant", "Pressure constant", "Temperature constant", "No constraints"], 
      correct: 0, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "In an isochoric process, volume remains constant. Since no expansion work is done (W = 0), all heat added goes to increasing internal energy."
      }
    },
    { 
      q: "The work done in an isothermal process is:", 
      options: ["Zero", "nRT ln(V2/V1)", "P(V2-V1)", "Constant"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "The work done in an isothermal process is nRT ln(V2/V1). This comes from integrating P dV with P = nRT/V for an ideal gas at constant temperature."
      }
    },
    { 
      q: "For an ideal gas, internal energy depends on:", 
      options: ["Pressure only", "Volume only", "Temperature only", "All three"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "For an ideal gas, internal energy depends on temperature only. This is a key characteristic of ideal gases described by Joule's law."
      }
    },
    { 
      q: "The Cp/Cv ratio (γ) for monoatomic gas is:", 
      options: ["1", "1.4", "1.67", "2"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "For monoatomic gases, γ = Cp/Cv = 1.67. This comes from degrees of freedom: 3 translational degrees give Cv = 3R/2, so Cp = 5R/2, and γ = 5/3 ≈ 1.67."
      }
    },
    { 
      q: "Stefan-Boltzmann law relates radiation to:", 
      options: ["T", "T²", "T³", "T⁴"], 
      correct: 3, 
      difficulty: 2,
      solution: {
        type: "definition",
        explanation: "Stefan-Boltzmann law states that radiant energy emitted per unit area is proportional to T⁴. The full equation is P = σAT⁴, where σ is Stefan-Boltzmann constant."
      }
    },
    { 
      q: "Wien's displacement law relates wavelength to:", 
      options: ["Temperature", "Pressure", "Volume", "Entropy"], 
      correct: 0, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "Wien's displacement law relates peak wavelength of blackbody radiation to temperature: λ_max × T = constant. Hotter objects emit shorter wavelength radiation."
      }
    },
    { 
      q: "The coefficient of thermal conductivity depends on:", 
      options: ["Temperature only", "Material only", "Both temperature and material", "Pressure only"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "The coefficient of thermal conductivity depends on both temperature and material. It generally decreases with temperature for metals but increases for gases and insulators."
      }
    },
    { 
      q: "During melting, temperature:", 
      options: ["Increases", "Decreases", "Remains constant", "Fluctuates"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "During melting, temperature remains constant. All heat energy goes into breaking molecular bonds to change phase rather than increasing temperature."
      }
    },
    { 
      q: "The triple point of water is at:", 
      options: ["0°C", "273.15 K", "273.16 K", "100°C"], 
      correct: 2, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "The triple point of water is at 273.16 K (0.01°C). This is the unique temperature and pressure where solid, liquid, and vapor phases coexist in equilibrium."
      }
    },
    { 
      q: "A refrigerator is essentially a:", 
      options: ["Heat engine", "Heat pump", "Carnot engine", "Isothermal device"], 
      correct: 1, 
      difficulty: 2,
      solution: {
        type: "concept",
        explanation: "A refrigerator is essentially a heat pump. It moves heat from a cold reservoir to a hot reservoir, requiring work input according to the second law of thermodynamics."
      }
    },

    // Hard (difficulty: 3)
    { 
      q: "Carnot engine efficiency depends on:", 
      options: ["Working substance", "Temperature of reservoirs", "Engine size", "Pressure"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Carnot engine efficiency depends only on the temperature of the reservoirs: η = 1 - T_cold/T_hot. It is independent of the working substance."
      }
    },
    { 
      q: "The efficiency of a Carnot engine is given by:", 
      options: ["1 - T1/T2", "1 - T2/T1", "T1/T2", "T2/T1"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "Carnot efficiency = 1 - T2/T1, where T1 is the hot reservoir temperature and T2 is the cold reservoir temperature (in Kelvin)."
      }
    },
    { 
      q: "The Clausius-Clapeyron equation relates:", 
      options: ["Pressure and temperature", "Volume and temperature", "Entropy and energy", "Work and heat"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "The Clausius-Clapeyron equation relates vapor pressure and temperature during phase transitions: dP/dT = ΔH/(TΔV), where ΔH is enthalpy of transition."
      }
    },
    { 
      q: "For a reversible adiabatic process, PVᵞ is:", 
      options: ["Zero", "Constant", "Increasing", "Decreasing"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "For a reversible adiabatic process of an ideal gas, PVᵞ is constant, where γ = Cp/Cv. This is derived from combining the ideal gas law with adiabatic condition."
      }
    },
    { 
      q: "The second law of thermodynamics can be stated using:", 
      options: ["Energy only", "Entropy", "Momentum", "Force"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The second law of thermodynamics can be stated using entropy: 'The entropy of an isolated system never decreases.' It defines the direction of spontaneous processes."
      }
    },
    { 
      q: "The COP of a refrigerator is:", 
      options: ["QL/W", "QH/W", "W/QL", "W/QH"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "COP of refrigerator = QL/W, where QL is heat removed from cold reservoir and W is work input. For a Carnot refrigerator, COP = T_cold/(T_hot - T_cold)."
      }
    },
    { 
      q: "In a Carnot cycle, the processes are:", 
      options: ["All isothermal", "All adiabatic", "Two isothermal and two adiabatic", "All isobaric"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "A Carnot cycle consists of two isothermal processes (at constant temperatures) and two adiabatic processes (no heat exchange), making it the most efficient possible cycle."
      }
    },
    { 
      q: "The maximum efficiency of a heat engine operating between 400K and 300K is:", 
      options: ["25%", "33%", "50%", "75%"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "problem",
        given: ["Hot reservoir T1 = 400K", "Cold reservoir T2 = 300K", "Carnot efficiency formula"],
        unknown: ["Maximum efficiency η = ?"],
        formula: "η = 1 - T2/T1",
        stepByStep: [
          "Apply Carnot efficiency formula: η = 1 - T2/T1",
          "Substitute values: η = 1 - 300/400",
          "Calculate: η = 1 - 0.75 = 0.25",
          "Convert to percentage: 0.25 × 100% = 25%"
        ],
        conclusion: "The maximum efficiency is 25%."
      }
    },
    { 
      q: "The entropy change in an irreversible process is:", 
      options: ["Zero", "Negative", "Positive", "Depends on temperature"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The entropy change in an irreversible process is always positive for an isolated system. Irreversible processes generate entropy due to dissipative effects."
      }
    },
    { 
      q: "The relation between Cp and Cv is:", 
      options: ["Cp = Cv + R", "Cp = Cv - R", "Cp = Cv × R", "Cp = Cv/R"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "definition",
        explanation: "For an ideal gas, Cp = Cv + R. The difference arises because at constant pressure, extra energy is needed to do expansion work against external pressure."
      }
    },
    { 
      q: "The Joule-Thomson coefficient is related to:", 
      options: ["Temperature change in adiabatic expansion", "Temperature change in free expansion", "Temperature change in throttling", "Entropy change"], 
      correct: 2, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The Joule-Thomson coefficient μ = (∂T/∂P)_H describes temperature change during throttling (constant enthalpy process through a porous plug or valve)."
      }
    },
    { 
      q: "In a polytropic process PVⁿ = constant, for n = 0:", 
      options: ["Isobaric", "Isochoric", "Isothermal", "Adiabatic"], 
      correct: 0, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "For n = 0 in PVⁿ = constant, we get P = constant, which represents an isobaric process (constant pressure process)."
      }
    },
    { 
      q: "The degrees of freedom for a diatomic gas molecule is:", 
      options: ["3", "5", "6", "7"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "A diatomic gas has 5 degrees of freedom: 3 translational + 2 rotational (rotation about the bond axis doesn't count at normal temperatures)."
      }
    },
    { 
      q: "The mean free path of gas molecules is inversely proportional to:", 
      options: ["Temperature", "Pressure", "Volume", "Mass"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "Mean free path λ ∝ 1/P. At higher pressure, molecules are closer together and collide more frequently, reducing the average distance between collisions."
      }
    },
    { 
      q: "The Van der Waals equation accounts for:", 
      options: ["Ideal behavior", "Real gas behavior", "Perfect gas behavior", "Isothermal behavior"], 
      correct: 1, 
      difficulty: 3,
      solution: {
        type: "concept",
        explanation: "The Van der Waals equation accounts for real gas behavior by including corrections for finite molecular size (parameter b) and intermolecular attractions (parameter a)."
      }
    }
  ],
}; 


<div className="mb-6">
  <ProgressDashboard 
    currentUser={currentUser} 
    darkMode={darkMode} 
    topics={topics} 
  />
</div>

{/* Then continue with the existing study sections... */}
const studyGuides = {
mechanics: {
  title: "Mechanics Study Guide",
  icon: "⚙️",
  color: "from-blue-500 to-cyan-500",
  sections: [
    {
      title: "Key Definitions",
      content: [
        { term: "Force", def: "A push or pull that can change the motion of an object. Measured in Newtons (N)." },
        { term: "Mass", def: "The amount of matter in an object. Measured in kilograms (kg)." },
        { term: "Velocity", def: "The rate of change of displacement. A vector quantity with magnitude and direction." },
        { term: "Acceleration", def: "The rate of change of velocity. Measured in m/s²." },
        { term: "Momentum", def: "The product of mass and velocity (p = mv). Measured in kg⋅m/s." },
        { term: "Work", def: "Energy transferred when a force moves an object. W = F⋅d. Measured in Joules (J)." },
        { term: "Power", def: "The rate of doing work. P = W/t. Measured in Watts (W)." },
        { term: "Kinetic Energy", def: "Energy due to motion. KE = ½mv². Measured in Joules (J)." },
        { term: "Potential Energy", def: "Energy due to position. PE = mgh. Measured in Joules (J)." },
        { term: "Friction", def: "Force that opposes motion between surfaces in contact." }
      ]
    },
    {
      title: "Essential Formulas with Detailed Explanations",
      expandableLaws: [
        {
          id: "newtons-second",
          title: "Newton's Second Law",
          formula: "F = ma",
          definition: "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The direction of acceleration is in the direction of the net force.",
          realLife: [
            "Pushing a shopping cart - heavier cart (more mass) needs more force to accelerate",
            "Car acceleration - sports car (less mass) accelerates faster than truck with same engine",
            "Rocket launch - as fuel burns, mass decreases, so acceleration increases"
          ],
          visual: (
  <div className="space-y-6">
    <h4 className="text-center font-bold text-lg mb-6">
      More Force → More Acceleration
    </h4>
    
    <div className="flex flex-col md:flex-row justify-around items-center gap-8">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
            ●
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl text-yellow-500">→</span>
            <span className="text-yellow-500 font-bold text-sm">F</span>
          </div>
        </div>
        <p className="font-semibold text-sm">Light Object</p>
        <p className="text-xs text-green-500 font-bold">⚡ Fast acceleration</p>
      </div>
      
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="flex -space-x-3">
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg border-2 border-blue-600">●</div>
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg border-2 border-blue-600 opacity-80">●</div>
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg border-2 border-blue-600 opacity-60">●</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl text-yellow-500">→</span>
            <span className="text-yellow-500 font-bold text-sm">F</span>
          </div>
        </div>
        <p className="font-semibold text-sm">Heavy Object</p>
        <p className="text-xs text-red-500 font-bold">🐌 Slow acceleration</p>
      </div>
    </div>
    
    <div className="mt-8 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
      <h5 className="font-bold text-center mb-3">F = ma relationship:</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 p-2 bg-black/20 rounded">
          <span className="text-green-400 text-xl">↑</span>
          <span>F (force up)</span>
          <span className="text-yellow-400 mx-2">→</span>
          <span className="text-green-400 text-xl">↑</span>
          <span>a (acceleration up)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-black/20 rounded">
          <span className="text-green-400 text-xl">↑</span>
          <span>m (mass up)</span>
          <span className="text-yellow-400 mx-2">→</span>
          <span className="text-red-400 text-xl">↓</span>
          <span>a (acceleration down)</span>
        </div>
      </div>
    </div>
  </div>
),
          symbols: [
            { symbol: "F", meaning: "Force (Newtons, N)" },
            { symbol: "m", meaning: "Mass (kilograms, kg)" },
            { symbol: "a", meaning: "Acceleration (m/s²)" }
          ],
            sampleProblem: {
            question: "A 1500 kg car accelerates from rest to 20 m/s in 8 seconds. What is the net force acting on the car?",
            given: [
              "m = 1500 kg (mass of car)",
              "u = 0 m/s (initial velocity - from rest)",
              "v = 20 m/s (final velocity)",
              "t = 8 s (time)"
            ],
            unknown: [
              "F = ? (net force)"
            ],
            solution: [
              "Step 1: Find acceleration using v = u + at",
              "a = (v - u) / t",
              "a = (20 - 0) / 8",
              "a = 2.5 m/s²",
              "",
              "Step 2: Apply Newton's Second Law (F = ma)",
              "F = m × a",
              "F = 1500 kg × 2.5 m/s²",
              "F = 3,750 N"
            ],
            conclusion: "The net force acting on the car is 3,750 N (or 3.75 kN). This force is responsible for accelerating the car from rest to 20 m/s."
          }
        },
        {
          id: "work-energy",
          title: "Work-Energy Theorem",
          formula: "W = ΔKE",
          definition: "The work done by the net force on an object equals the change in its kinetic energy. Work transfers energy to or from an object.",
          realLife: [
            "Lifting weights - you do work against gravity, converting chemical energy to gravitational PE",
            "Braking a car - friction does negative work, converting KE to heat",
            "Throwing a ball - your hand does work, giving the ball kinetic energy"
          ],
          visual: (
  <div className="space-y-6">
    <h4 className="text-center font-bold text-lg mb-6">
      Work → Energy Transfer
    </h4>
    
    <div className="flex flex-col md:flex-row justify-around items-center gap-8">
      <div className="text-center space-y-3 flex-1">
        <p className="font-bold text-lg text-cyan-400">Before:</p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">●</div>
          <span className="text-3xl text-yellow-500">→ F</span>
        </div>
        <div className="space-y-1 text-sm">
          <p>v = 0</p>
          <p className="text-red-400">KE = 0</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="text-5xl text-green-400 animate-pulse">→</div>
      </div>
      
      <div className="text-center space-y-3 flex-1">
        <p className="font-bold text-lg text-cyan-400">After:</p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">●</div>
          <span className="text-3xl text-green-500">→</span>
        </div>
        <div className="space-y-1 text-sm">
          <p>v = final</p>
          <p className="text-green-400">KE = ½mv²</p>
        </div>
      </div>
    </div>
    
    <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl border border-cyan-500/30 text-center">
      <p className="font-bold text-lg">Work Done = Change in KE</p>
      <p className="text-xl mt-2 font-mono">W = ΔKE = KE<sub>final</sub> - KE<sub>initial</sub></p>
    </div>
  </div>
),
          symbols: [
            { symbol: "W", meaning: "Work (Joules, J)" },
            { symbol: "F", meaning: "Force (Newtons, N)" },
            { symbol: "d", meaning: "Displacement (meters, m)" },
            { symbol: "KE", meaning: "Kinetic Energy (J)" }
          ],
          sampleProblem: {
            question: "A 2 kg object is pushed by a 10 N force for 5 meters. If it starts from rest, what is its final velocity?",
            given: [
              "m = 2 kg (mass)",
              "F = 10 N (applied force)",
              "d = 5 m (displacement)",
              "u = 0 m/s (starts from rest)"
            ],
            unknown: [
              "v = ? (final velocity)"
            ],
            solution: [
              "Step 1: Calculate work done",
              "W = F × d",
              "W = 10 N × 5 m = 50 J",
              "",
              "Step 2: Use work-energy theorem (W = ΔKE)",
              "W = ½mv² - ½mu²",
              "50 = ½(2)v² - 0",
              "50 = v²",
              "v = √50 = 7.07 m/s"
            ],
            conclusion: "The final velocity of the object is 7.07 m/s. All the work done by the force was converted into kinetic energy."
          }
        },
        {
          id: "momentum",
          title: "Conservation of Momentum",
          formula: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",
          definition: "In a closed system with no external forces, the total momentum before a collision equals the total momentum after the collision.",
          realLife: [
            "Pool balls colliding - momentum transfers from cue ball to other balls",
            "Rocket propulsion - rocket gains forward momentum as fuel is expelled backward",
            "Car crash - total momentum of both cars before = total after"
          ],
          visual: (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row justify-around items-center gap-8">
      <div className="text-center space-y-3 flex-1">
        <p className="font-bold text-lg text-cyan-400">Before Collision:</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">A</div>
            <span className="text-2xl text-yellow-500 mt-1">→</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">B</div>
            <span className="text-2xl text-yellow-500 mt-1">←</span>
          </div>
        </div>
        <p className="text-sm font-mono">m<sub>A</sub>v<sub>A</sub> + m<sub>B</sub>v<sub>B</sub></p>
      </div>
      
      <div className="flex items-center justify-center text-4xl font-bold text-green-400">=</div>
      
      <div className="text-center space-y-3 flex-1">
        <p className="font-bold text-lg text-cyan-400">After Collision:</p>
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">A</div>
            <span className="text-2xl text-green-500 mt-1">→</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">B</div>
            <span className="text-2xl text-green-500 mt-1">→</span>
          </div>
        </div>
        <p className="text-sm font-mono">m<sub>A</sub>v'<sub>A</sub> + m<sub>B</sub>v'<sub>B</sub></p>
      </div>
    </div>
    
    <div className="mt-8 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30 text-center">
      <p className="font-bold text-xl text-green-400">Total momentum conserved!</p>
      <p className="text-lg mt-2 font-mono">p<sub>initial</sub> = p<sub>final</sub></p>
    </div>
  </div>
),
          symbols: [
            { symbol: "m₁, m₂", meaning: "Masses of objects (kg)" },
            { symbol: "u₁, u₂", meaning: "Initial velocities (m/s)" },
            { symbol: "v₁, v₂", meaning: "Final velocities (m/s)" }
          ],
          sampleProblem: {
            question: "A 1000 kg car moving at 20 m/s collides with a stationary 1500 kg truck. After collision, they stick together. Find their common velocity.",
            given: [
              "m₁ = 1000 kg (mass of car)",
              "u₁ = 20 m/s (initial velocity of car)",
              "m₂ = 1500 kg (mass of truck)",
              "u₂ = 0 m/s (truck at rest)"
            ],
            unknown: [
              "v = ? (common velocity after collision)"
            ],
            solution: [
              "Step 1: Apply conservation of momentum",
              "m₁u₁ + m₂u₂ = (m₁ + m₂)v",
              "",
              "Step 2: Substitute values",
              "(1000)(20) + (1500)(0) = (1000 + 1500)v",
              "20,000 = 2500v",
              "v = 8 m/s"
            ],
            conclusion: "The common velocity after collision is 8 m/s in the direction of the car's initial motion. This is a perfectly inelastic collision."
          }
        },
        {
          id: "kinetic-energy",
          title: "Kinetic Energy",
          formula: "KE = ½mv²",
          definition: "Energy possessed by an object due to its motion. Kinetic energy is directly proportional to mass and to the square of velocity.",
          realLife: [
            "Moving car has kinetic energy - faster speed means much more energy (squared relationship)",
            "Bullet's kinetic energy causes damage - small mass but very high velocity",
            "Wind turbines convert wind's kinetic energy to electrical energy"
          ],
          visual: (
  <div className="space-y-6">
    <h4 className="text-center font-bold text-lg mb-6">
      KE depends on v² !
    </h4>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">●</div>
          <span className="text-xl">→</span>
        </div>
        <span className="font-mono">v = 10 m/s</span>
        <span className="font-bold text-green-400">KE = x</span>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg">●</div>
          <span className="text-xl">→→</span>
        </div>
        <span className="font-mono">v = 20 m/s</span>
        <span className="font-bold text-yellow-400">KE = 4x</span>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl border border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">●</div>
          <span className="text-xl">→→→</span>
        </div>
        <span className="font-mono">v = 30 m/s</span>
        <span className="font-bold text-red-400">KE = 9x</span>
      </div>
    </div>
    
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 text-center">
      <p className="text-sm text-gray-300 mb-2">Doubled speed = 4× energy!</p>
      <p className="text-2xl font-bold font-mono">KE = ½mv²</p>
      <p className="text-xs mt-2 text-gray-400">Moving object has energy</p>
    </div>
  </div>
),
          symbols: [
            { symbol: "KE", meaning: "Kinetic Energy (Joules, J)" },
            { symbol: "m", meaning: "Mass (kilograms, kg)" },
            { symbol: "v", meaning: "Velocity (m/s)" }
          ],
            sampleProblem: {
            question: "A 1200 kg car is traveling at 25 m/s. What is its kinetic energy?",
            given: [
              "m = 1200 kg (mass of car)",
              "v = 25 m/s (velocity)"
            ],
            unknown: [
              "KE = ? (kinetic energy)"
            ],
            solution: [
              "Step 1: Apply kinetic energy formula",
              "KE = ½mv²",
              "",
              "Step 2: Substitute values",
              "KE = ½ × 1200 kg × (25 m/s)²",
              "KE = ½ × 1200 × 625",
              "KE = 375,000 J"
            ],
            conclusion: "The kinetic energy of the car is 375,000 J or 375 kJ. This energy would need to be dissipated to bring the car to a complete stop."
          }
        },
        {
          id: "potential-energy",
          title: "Gravitational Potential Energy",
          formula: "PE = mgh",
          definition: "Energy possessed by an object due to its position in a gravitational field. PE increases with height above a reference point.",
          realLife: [
            "Water stored in dam - high PE converted to KE when released",
            "Roller coaster at the top of hill - maximum PE, minimum KE",
            "Book on shelf has PE - falls and converts to KE"
          ],
        visual: (
  <div className="space-y-6">
    <h4 className="text-center font-bold text-lg mb-6">
      Height → More PE
    </h4>
    
    <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-8 border border-gray-600">
      {/* Vertical reference line */}
      <div className="absolute left-12 top-8 bottom-16 w-0.5 bg-gray-500"></div>
      
      {/* Height markers */}
      <div className="space-y-12">
        {/* h = 3m */}
        <div className="flex items-center gap-4 justify-between">
          <span className="font-mono text-sm text-gray-400 w-16">h = 3m</span>
          <div className="flex-1 flex items-center gap-4">
            <div className="h-0.5 w-8 bg-gray-500"></div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">●</div>
          </div>
          <span className="text-sm font-mono text-red-400 w-32 text-right">PE = 3mgh</span>
        </div>
        
        {/* h = 2m */}
        <div className="flex items-center gap-4 justify-between">
          <span className="font-mono text-sm text-gray-400 w-16">h = 2m</span>
          <div className="flex-1 flex items-center gap-4">
            <div className="h-0.5 w-8 bg-gray-500"></div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg">●</div>
          </div>
          <span className="text-sm font-mono text-yellow-400 w-32 text-right">PE = 2mgh</span>
        </div>
        
        {/* h = 1m */}
        <div className="flex items-center gap-4 justify-between">
          <span className="font-mono text-sm text-gray-400 w-16">h = 1m</span>
          <div className="flex-1 flex items-center gap-4">
            <div className="h-0.5 w-8 bg-gray-500"></div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">●</div>
          </div>
          <span className="text-sm font-mono text-green-400 w-32 text-right">PE = mgh</span>
        </div>
      </div>
      
      {/* Ground level */}
      <div className="mt-8 pt-4 border-t-4 border-blue-500 text-center">
        <p className="font-bold text-sm text-blue-400">h = 0 (reference level)</p>
      </div>
    </div>
    
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl border border-cyan-500/30 text-center">
      <p className="font-bold text-xl text-cyan-400">Higher position = More PE</p>
    </div>
  </div>
),
          symbols: [
            { symbol: "PE", meaning: "Potential Energy (Joules, J)" },
            { symbol: "m", meaning: "Mass (kilograms, kg)" },
            { symbol: "g", meaning: "Gravitational acceleration (9.8 m/s²)" },
            { symbol: "h", meaning: "Height (meters, m)" }
          ],
          sampleProblem: {
            question: "A 5 kg object is lifted to a height of 10 meters. What is its gravitational potential energy? (g = 10 m/s²)",
            given: [
              "m = 5 kg (mass)",
              "h = 10 m (height)",
              "g = 10 m/s² (gravitational acceleration)"
            ],
            unknown: [
              "PE = ? (potential energy)"
            ],
            solution: [
              "Step 1: Apply potential energy formula",
              "PE = mgh",
              "",
              "Step 2: Substitute values",
              "PE = 5 kg × 10 m/s² × 10 m",
              "PE = 500 J"
            ],
            conclusion: "The gravitational potential energy is 500 J. This energy can be converted to kinetic energy if the object falls."
          }
        },
        {
          id: "power",
          title: "Power",
          formula: "P = W/t",
          definition: "The rate at which work is done or energy is transferred. Power tells us how quickly energy is being used or converted.",
          realLife: [
            "Light bulb - 60W bulb uses 60 Joules per second",
            "Car engine - high power means can do work quickly (accelerate fast)",
            "Electric motor - power rating tells how fast it can lift loads"
          ],
          visual: (
  <div className="space-y-6">
    <h4 className="text-center font-bold text-lg mb-6">
      Power = Work per Time
    </h4>
    
    <p className="text-center text-sm text-gray-300 mb-4">Same Work, Different Time:</p>
    
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
        <p className="font-bold text-green-400 mb-3">Fast (High Power):</p>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">●</div>
          <div className="flex-1 h-1 bg-green-500 rounded relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-green-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
        <p className="text-sm text-right mt-2 text-gray-300">(5 seconds)</p>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-500/30">
        <p className="font-bold text-orange-400 mb-3">Slow (Low Power):</p>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">●</div>
          <div className="flex-1 h-1 bg-orange-500 rounded relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-orange-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
        <p className="text-sm text-right mt-2 text-gray-300">(10 seconds)</p>
      </div>
    </div>
    
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 text-center">
      <p className="text-lg font-mono mb-2">P = W/t</p>
      <p className="text-sm text-gray-300">More power = Less time</p>
    </div>
  </div>
),
          symbols: [
            { symbol: "P", meaning: "Power (Watts, W)" },
            { symbol: "W", meaning: "Work (Joules, J)" },
            { symbol: "t", meaning: "Time (seconds, s)" }
          ],
          sampleProblem: {
            question: "A crane lifts a 500 kg load 20 meters in 25 seconds. What is the power output? (g = 10 m/s²)",
            given: [
              "m = 500 kg (mass of load)",
              "h = 20 m (height)",
              "t = 25 s (time)",
              "g = 10 m/s² (gravitational acceleration)"
            ],
            unknown: [
              "P = ? (power output)"
            ],
            solution: [
              "Step 1: Calculate work done",
              "W = mgh = 500 × 10 × 20 = 100,000 J",
              "",
              "Step 2: Calculate power",
              "P = W/t = 100,000 J / 25 s",
              "P = 4,000 W"
            ],
            conclusion: "The power output of the crane is 4,000 W or 4 kW. This is the rate at which the crane does work against gravity."
          }
        },
        {
          id: "first-equation",
          title: "First Equation of Motion",
          formula: "v = u + at",
          definition: "Relates final velocity to initial velocity, acceleration, and time. Shows how velocity changes uniformly with constant acceleration.",
          realLife: [
            "Car speeding up from traffic light - velocity increases linearly with time",
            "Ball rolling down incline - gains speed at constant rate",
            "Free falling object - velocity increases by 9.8 m/s every second"
          ],
visual: (
  <div className="space-y-6">
    <h4 className="text-center font-bold text-lg mb-6">
      Velocity increases with time
    </h4>
    
    <div className="relative w-full h-80 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-600 overflow-hidden">
      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis (Velocity) */}
        <line x1="40" y1="20" x2="40" y2="260" stroke="#9CA3AF" strokeWidth="2" />
        {/* Y-axis arrow */}
        <polygon points="40,20 35,30 45,30" fill="#9CA3AF" />
        {/* Y-axis label */}
        <text x="25" y="25" fill="#9CA3AF" fontSize="16" fontWeight="bold">v</text>
        
        {/* X-axis (Time) */}
        <line x1="40" y1="260" x2="380" y2="260" stroke="#9CA3AF" strokeWidth="2" />
        {/* X-axis arrow */}
        <polygon points="380,260 370,255 370,265" fill="#9CA3AF" />
        {/* X-axis label */}
        <text x="360" y="280" fill="#9CA3AF" fontSize="16" fontWeight="bold">t</text>
        
        {/* Diagonal line (v = u + at) */}
        <line x1="40" y1="260" x2="340" y2="80" stroke="#22D3EE" strokeWidth="3" />
        
        {/* Initial velocity label (u) */}
        <text x="20" y="270" fill="#22D3EE" fontSize="14" fontWeight="bold">u</text>
        <circle cx="40" cy="260" r="4" fill="#22D3EE" />
        
        {/* Final velocity point */}
        <circle cx="340" cy="80" r="4" fill="#22D3EE" />
        
        {/* Slope label */}
        <text x="200" y="140" fill="#FCD34D" fontSize="14" fontWeight="bold">Slope = a</text>
        
        {/* Grid lines (optional for better readability) */}
        <line x1="40" y1="180" x2="380" y2="180" stroke="#4B5563" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
        <line x1="40" y1="100" x2="380" y2="100" stroke="#4B5563" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
        <line x1="140" y1="260" x2="140" y2="20" stroke="#4B5563" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
        <line x1="240" y1="260" x2="240" y2="20" stroke="#4B5563" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
      </svg>
    </div>
    
    <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30 text-center">
      <p className="text-2xl font-bold font-mono text-cyan-400">v = u + at</p>
    </div>
  </div>
),
          symbols: [
            { symbol: "v", meaning: "Final velocity (m/s)" },
            { symbol: "u", meaning: "Initial velocity (m/s)" },
            { symbol: "a", meaning: "Acceleration (m/s²)" },
            { symbol: "t", meaning: "Time (seconds, s)" }
          ],
            sampleProblem: {
            question: "A car accelerates from 10 m/s at 2 m/s² for 5 seconds. What is its final velocity?",
            given: [
              "u = 10 m/s (initial velocity)",
              "a = 2 m/s² (acceleration)",
              "t = 5 s (time)"
            ],
            unknown: [
              "v = ? (final velocity)"
            ],
            solution: [
              "Step 1: Apply first equation of motion",
              "v = u + at",
              "",
              "Step 2: Substitute values",
              "v = 10 + (2)(5)",
              "v = 10 + 10",
              "v = 20 m/s"
            ],
            conclusion: "The final velocity is 20 m/s. The car's velocity increased by 10 m/s during the 5-second acceleration period."
          }
        }
      ]
    },
      {
        title: "Visual Concepts",
        diagrams: [
        { 
          name: "Free Body Diagram",
          svg: (
            <svg viewBox="0 0 250 250" className="w-full h-auto">
              <defs>
                <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#22C55E"/>
                </marker>
                <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#EF4444"/>
                </marker>
                <marker id="arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#FBBF24"/>
                </marker>
                <marker id="arrowCyan" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#06B6D4"/>
                </marker>
              </defs>
              
              {/* Object (box) */}
              <rect x="100" y="100" width="50" height="50" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="4"/>
              <text x="125" y="130" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">m</text>
              
              {/* Normal Force (N) - upward */}
              <line x1="125" y1="100" x2="125" y2="40" stroke="#22C55E" strokeWidth="4" markerEnd="url(#arrowGreen)"/>
              <text x="140" y="60" fill="#22C55E" fontSize="16" fontWeight="bold">Fn</text>
              
              {/* Weight (mg) - downward */}
              <line x1="125" y1="150" x2="125" y2="210" stroke="#EF4444" strokeWidth="4" markerEnd="url(#arrowRed)"/>
              <text x="140" y="190" fill="#EF4444" fontSize="16" fontWeight="bold">Fgrav</text>
              
              {/* Applied Force (F) - horizontal right */}
              <line x1="150" y1="125" x2="210" y2="125" stroke="#FBBF24" strokeWidth="4" markerEnd="url(#arrowYellow)"/>
              <text x="190" y="115" fill="#FBBF24" fontSize="16" fontWeight="bold">Fapp</text>
              
              {/* Friction (f) - horizontal left */}
              <line x1="100" y1="125" x2="40" y2="125" stroke="#06B6D4" strokeWidth="4" markerEnd="url(#arrowCyan)"/>
              <text x="50" y="115" fill="#06B6D4" fontSize="16" fontWeight="bold">Ffric</text>
              
              {/* Ground line */}
              <line x1="20" y1="150" x2="230" y2="150" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="20" y1="150" x2="20" y2="155" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="40" y1="150" x2="40" y2="155" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="60" y1="150" x2="60" y2="155" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="80" y1="150" x2="80" y2="155" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="170" y1="150" x2="170" y2="155" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="190" y1="150" x2="190" y2="155" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="210" y1="150" x2="210" y2="155" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="230" y1="150" x2="230" y2="155" stroke="#94A3B8" strokeWidth="2"/>
            </svg>
          ),
          description: "Shows all forces acting on an object: Normal force (N) upward, Weight (mg) downward, Applied force (F) horizontal, and Friction (f) opposing motion."
        },
        {
          name: "Projectile Motion",
          svg: (
            <svg viewBox="0 0 400 280" className="w-full h-auto">
              <defs>
                <marker id="velocityArrow" markerWidth="8" markerHeight="7" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#3B82F6"/>
                </marker>
              </defs>
              
              {/* Ground */}
              <line x1="0" y1="240" x2="400" y2="240" stroke="#94A3B8" strokeWidth="3"/>
              <line x1="0" y1="240" x2="0" y2="245" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="80" y1="240" x2="80" y2="245" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="160" y1="240" x2="160" y2="245" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="240" y1="240" x2="240" y2="245" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="320" y1="240" x2="320" y2="245" stroke="#94A3B8" strokeWidth="2"/>
              <line x1="400" y1="240" x2="400" y2="245" stroke="#94A3B8" strokeWidth="2"/>
              
              {/* Launch point */}
              <circle cx="40" cy="240" r="5" fill="#EF4444"/>
              
              {/* Optimal trajectory (45°) */}
              <path d="M 40 240 Q 150 80, 260 240" fill="none" stroke="#FBBF24" strokeWidth="3"/>
              
              {/* Lower angle trajectory (30°) */}
              <path d="M 40 240 Q 120 140, 200 240" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5"/>
              
              {/* Higher angle trajectory (60°) */}
              <path d="M 40 240 Q 110 60, 180 240" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="5,5"/>
              
              {/* Projectile positions */}
              <circle cx="80" cy="180" r="4" fill="#3B82F6"/>
              <circle cx="150" cy="80" r="4" fill="#3B82F6"/>
              <circle cx="220" cy="180" r="4" fill="#3B82F6"/>
              
              {/* Velocity vectors */}
              <line x1="80" y1="180" x2="110" y2="160" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#velocityArrow)"/>
              <line x1="150" y1="80" x2="180" y2="80" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#velocityArrow)"/>
              <line x1="220" y1="180" x2="240" y2="200" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#velocityArrow)"/>
              
              {/* Max height indicator */}
              <line x1="150" y1="160" x2="150" y2="240" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3"/>
              <text x="150" y="65" fill="#A855F7" fontSize="13" fontWeight="bold" textAnchor="middle">h_max</text>
              
              {/* Range indicator */}
              <line x1="40" y1="255" x2="260" y2="255" stroke="#06B6D4" strokeWidth="2"/>
              <line x1="40" y1="250" x2="40" y2="260" stroke="#06B6D4" strokeWidth="2"/>
              <line x1="260" y1="250" x2="260" y2="260" stroke="#06B6D4" strokeWidth="2"/>
              <text x="150" y="270" fill="#06B6D4" fontSize="13" fontWeight="bold" textAnchor="middle">Range (R)</text>
              
              {/* Launch angle */}
              <path d="M 60 240 Q 65 230, 70 225" fill="none" stroke="#FBBF24" strokeWidth="2"/>
              <text x="75" y="230" fill="#FBBF24" fontSize="12" fontWeight="bold">θ</text>
              
              {/* Legend */}
              <text x="280" y="40" fill="#FBBF24" fontSize="12" fontWeight="bold">45° (max range)</text>
              <text x="280" y="60" fill="#3B82F6" fontSize="11">30° (lower)</text>
              <text x="280" y="80" fill="#22C55E" fontSize="11">60° (higher)</text>
            </svg>
          ),
          description: "Parabolic trajectory showing: horizontal velocity constant, vertical velocity changes due to gravity. Maximum range at 45° launch angle."
        },
        { 
          name: "Inclined Plane Forces",
          svg: (
            <svg viewBox="0 0 350 280" className="w-full h-auto">
              <defs>
                <marker id="forceArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#EF4444"/>
                </marker>
                <marker id="componentArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#A855F7"/>
                </marker>
                <marker id="normalArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#22C55E"/>
                </marker>
              </defs>
              
              {/* Ground */}
              <line x1="0" y1="220" x2="350" y2="220" stroke="#64748B" strokeWidth="3"/>
              
              {/* Inclined plane */}
              <line x1="50" y1="220" x2="280" y2="80" stroke="#94A3B8" strokeWidth="5"/>
              
              {/* Object on incline */}
              <rect x="140" y="120" width="40" height="40" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="4" transform="rotate(-30 160 140)"/>
              <text x="160" y="145" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">m</text>
              
              {/* Weight (mg) - straight down */}
              <line x1="160" y1="140" x2="160" y2="210" stroke="#EF4444" strokeWidth="3" markerEnd="url(#forceArrow)"/>
              <text x="170" y="185" fill="#EF4444" fontSize="10" fontWeight="bold">Fgrav</text>
              
              {/* Component parallel to plane (mg sinθ) */}
              <line x1="160" y1="140" x2="210" y2="115" stroke="#A855F7" strokeWidth="3" markerEnd="url(#componentArrow)"/>
              <text x="180" y="100" fill="#A855F7" fontSize="10" fontWeight="bold">Fgrav sin θ</text>
              
              {/* Component perpendicular to plane (mg cosθ) */}
              <line x1="160" y1="140" x2="135" y2="170" stroke="#06B6D4" strokeWidth="3" markerEnd="url(#componentArrow)"/>
              <text x="70" y="165" fill="#06B6D4" fontSize="12" fontWeight="bold">Fgrav cos θ</text>
              
              {/* Normal force */}
              <line x1="160" y1="140" x2="185" y2="110" stroke="#22C55E" strokeWidth="3" markerEnd="url(#normalArrow)"/>
              <text x="150" y="110" fill="#22C55E" fontSize="14" fontWeight="bold">Fn</text>
              
              {/* Angle θ */}
              <path d="M 80 220 Q 90 210, 100 205" fill="none" stroke="#FBBF24" strokeWidth="3"/>
              <text x="105" y="215" fill="#FBBF24" fontSize="14" fontWeight="bold">θ</text>
              
              {/* Dashed lines showing components */}
              <line x1="160" y1="140" x2="210" y2="115" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
              <line x1="160" y1="140" x2="135" y2="170" stroke="#06B6D4" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
              
              {/* Right angle indicator for perpendicular component */}
              <line x1="155" y1="155" x2="150" y2="160" stroke="#94A3B8" strokeWidth="1"/>
              <line x1="150" y1="160" x2="145" y2="165" stroke="#94A3B8" strokeWidth="1"/>
              
              {/* Info box */}
              <rect x="10" y="10" width="150" height="60" fill="none" stroke="#A855F7" strokeWidth="2" rx="5"/>
              <text x="85" y="30" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">Force Components:</text>
              <text x="85" y="48" fill="#A855F7" fontSize="11" textAnchor="middle">Parallel: Fgrav sin θ</text>
              <text x="85" y="62" fill="#06B6D4" fontSize="11" textAnchor="middle">Perpendicular: Fgrav cos θ</text>
            </svg>
          ),
          description: "Forces on inclined plane: Weight (Fgrav) resolves into components parallel (Fgrav sin θ) and perpendicular (Fgrav cos θ) to surface. Normal force (Fn) equals Fgrav cos θ."
        },
        { 
          name: "Circular Motion",
          svg: (
            <svg viewBox="0 0 200 200" className="w-full h-auto">
              <defs>
                <marker id="arrowCyan" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#06B6D4"/>
                </marker>
              </defs>
              
              {/* Circular path */}
              <circle cx="100" cy="100" r="60" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,5"/>
              
              {/* Center point */}
              <circle cx="100" cy="100" r="3" fill="#64748B"/>
              <text x="105" y="105" fill="#64748B" fontSize="12">O</text>
              
              {/* Object on circle */}
              <circle cx="160" cy="100" r="6" fill="#3B82F6"/>
              
              {/* Velocity vector (tangent) */}
              <line x1="160" y1="100" x2="160" y2="50" stroke="#22C55E" strokeWidth="2.5" markerEnd="url(#arrowCyan)"/>
              <text x="170" y="80" fill="#22C55E" fontSize="14" fontWeight="bold">v</text>
              
              {/* Centripetal force (toward center) */}
              <line x1="160" y1="100" x2="110" y2="100" stroke="#EF4444" strokeWidth="2.5" markerEnd="url(#arrowCyan)"/>
              <text x="135" y="90" fill="#EF4444" fontSize="14" fontWeight="bold">Fc</text>
              
              {/* Radius */}
              <line x1="100" y1="100" x2="160" y2="100" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3,3"/>
              <text x="125" y="115" fill="#FBBF24" fontSize="12">r</text>
            </svg>
          ),
          description: "Object moving in circular path showing centripetal force directed toward the center."
        }
      ]
    }
  ]
},
  electricity: {
  title: "Electricity & Magnetism Study Guide",
  icon: "⚡",
  color: "from-yellow-500 to-orange-500",
  sections: [
    {
      title: "Key Definitions",
      content: [
        { term: "Electric Current", def: "The flow of electric charge. Measured in Amperes (A)." },
        { term: "Voltage", def: "Electric potential difference. The energy per unit charge. Measured in Volts (V)." },
        { term: "Resistance", def: "Opposition to current flow. Measured in Ohms (Ω)." },
        { term: "Electric Field", def: "Region around a charged object where electric forces are exerted." },
        { term: "Magnetic Field", def: "Region around a magnet or current-carrying wire where magnetic forces exist." },
        { term: "Capacitance", def: "Ability to store electric charge. Measured in Farads (F)." },
        { term: "Inductance", def: "Property of a conductor to oppose changes in current. Measured in Henrys (H)." },
        { term: "EMF", def: "Electromotive Force - the voltage generated by a battery or generator." },
        { term: "Power", def: "Rate of energy transfer in a circuit. P = VI. Measured in Watts (W)." }
      ]
    },
    {
      title: "Essential Formulas with Detailed Explanations",
      expandableLaws: [
        {
          id: "ohms-law",
          title: "Ohm's Law",
          formula: "V = IR",
          definition: "The current through a conductor is directly proportional to the voltage across it and inversely proportional to its resistance. This fundamental relationship governs how electricity flows in circuits.",
          realLife: [
            "Home wiring - thicker wires (less resistance) carry more current at same voltage",
            "Dimmer switches - increase resistance to reduce current and dim lights",
            "Electric heaters - high resistance converts electrical energy to heat"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                V = IR Relationship
              </h4>
              
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Circuit diagram */}
                <defs>
                  <marker id="currentArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#EF4444"/>
                  </marker>
                </defs>
                
                {/* Battery */}
                <line x1="50" y1="80" x2="50" y2="120" stroke="#22C55E" strokeWidth="8"/>
                <line x1="60" y1="85" x2="60" y2="115" stroke="#22C55E" strokeWidth="4"/>
                <text x="30" y="105" fill="#22C55E" fontSize="16" fontWeight="bold">+</text>
                <text x="70" y="105" fill="#EF4444" fontSize="16" fontWeight="bold">-</text>
                <text x="35" y="140" fill="#9CA3AF" fontSize="14">V</text>
                
                {/* Wires */}
                <line x1="60" y1="100" x2="150" y2="100" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="250" y1="100" x2="350" y2="100" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="350" y1="100" x2="350" y2="180" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="350" y1="180" x2="50" y2="180" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="50" y1="180" x2="50" y2="120" stroke="#FBBF24" strokeWidth="3"/>
                
                {/* Resistor */}
                <rect x="150" y="85" width="100" height="30" fill="none" stroke="#3B82F6" strokeWidth="3" rx="5"/>
                <path d="M 160 100 L 170 90 L 180 110 L 190 90 L 200 110 L 210 90 L 220 110 L 230 90 L 240 100" 
                      fill="none" stroke="#3B82F6" strokeWidth="2"/>
                <text x="190" y="135" fill="#3B82F6" fontSize="14" fontWeight="bold">R</text>
                
                {/* Current direction */}
                <line x1="280" y1="100" x2="320" y2="100" stroke="#EF4444" strokeWidth="2" markerEnd="url(#currentArrow)"/>
                <text x="290" y="90" fill="#EF4444" fontSize="14" fontWeight="bold">I</text>
              </svg>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30 text-center">
                  <p className="text-green-400 font-bold text-lg mb-1">↑ V</p>
                  <p className="text-xs text-gray-400">More Voltage</p>
                  <p className="text-green-400 text-2xl">⇒</p>
                  <p className="text-green-400 font-bold text-lg mt-1">↑ I</p>
                  <p className="text-xs text-gray-400">More Current</p>
                </div>
                
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30 text-center">
                  <p className="text-blue-400 font-bold text-lg mb-1">↑ R</p>
                  <p className="text-xs text-gray-400">More Resistance</p>
                  <p className="text-red-400 text-2xl">⇒</p>
                  <p className="text-red-400 font-bold text-lg mt-1">↓ I</p>
                  <p className="text-xs text-gray-400">Less Current</p>
                </div>
                
                <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30 text-center">
                  <p className="text-purple-400 font-bold text-sm">V = constant</p>
                  <p className="text-purple-400 text-xl mt-2">I ∝ 1/R</p>
                  <p className="text-xs text-gray-400 mt-1">Inverse relationship</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "V", meaning: "Voltage/Potential Difference (Volts, V)" },
            { symbol: "I", meaning: "Current (Amperes, A)" },
            { symbol: "R", meaning: "Resistance (Ohms, Ω)" }
          ],
          sampleProblem: {
            question: "A 12V battery is connected to a 3Ω resistor. Calculate the current flowing through the circuit.",
            given: [
              "V = 12 V (voltage)",
              "R = 3 Ω (resistance)"
            ],
            unknown: [
              "I = ? (current)"
            ],
            solution: [
              "Step 1: Apply Ohm's Law",
              "V = IR",
              "",
              "Step 2: Rearrange for I",
              "I = V/R",
              "",
              "Step 3: Substitute values",
              "I = 12 V / 3 Ω",
              "I = 4 A"
            ],
            conclusion: "The current flowing through the circuit is 4 Amperes. This current is determined by the voltage of the battery and the resistance of the resistor."
          }
        },
        
        {
          id: "electric-power",
          title: "Electric Power",
          formula: "P = VI = I²R = V²/R",
          definition: "Electric power is the rate at which electrical energy is converted to another form of energy (heat, light, motion). It represents how quickly energy is being used or transferred in an electrical circuit.",
          realLife: [
            "Light bulbs - 60W bulb uses 60 Joules per second",
            "Electric bills - charged based on power consumption (kWh)",
            "Phone chargers - different power ratings affect charging speed"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Power Formulas
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl border border-red-500/30">
                  <p className="text-center text-2xl font-bold font-mono text-red-400 mb-3">P = VI</p>
                  <p className="text-center text-sm text-gray-400">Basic form</p>
                  <p className="text-center text-xs text-gray-500 mt-2">Use when V and I are known</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-500/30">
                  <p className="text-center text-2xl font-bold font-mono text-yellow-400 mb-3">P = I²R</p>
                  <p className="text-center text-sm text-gray-400">Current form</p>
                  <p className="text-center text-xs text-gray-500 mt-2">Use when I and R are known</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
                  <p className="text-center text-2xl font-bold font-mono text-green-400 mb-3">P = V²/R</p>
                  <p className="text-center text-sm text-gray-400">Voltage form</p>
                  <p className="text-center text-xs text-gray-500 mt-2">Use when V and R are known</p>
                </div>
              </div>
              
              <svg viewBox="0 0 300 200" className="w-full h-auto mt-6">
                {/* Power dissipation illustration */}
                <rect x="100" y="70" width="100" height="60" fill="#EF4444" opacity="0.2" stroke="#EF4444" strokeWidth="2" rx="5"/>
                <text x="150" y="95" fill="#EF4444" fontSize="16" fontWeight="bold" textAnchor="middle">Resistor</text>
                <text x="150" y="115" fill="#FBBF24" fontSize="14" textAnchor="middle">P = I²R</text>
                
                {/* Heat waves */}
                <path d="M 120 50 Q 125 45, 130 50" fill="none" stroke="#F97316" strokeWidth="2"/>
                <path d="M 140 45 Q 145 40, 150 45" fill="none" stroke="#F97316" strokeWidth="2"/>
                <path d="M 160 50 Q 165 45, 170 50" fill="none" stroke="#F97316" strokeWidth="2"/>
                <text x="150" y="35" fill="#F97316" fontSize="12" textAnchor="middle">Heat Energy</text>
                
                {/* Current in */}
                <line x1="50" y1="100" x2="100" y2="100" stroke="#3B82F6" strokeWidth="3"/>
                <polygon points="90,95 100,100 90,105" fill="#3B82F6"/>
                <text x="75" y="90" fill="#3B82F6" fontSize="14" fontWeight="bold">I</text>
                
                {/* Current out */}
                <line x1="200" y1="100" x2="250" y2="100" stroke="#3B82F6" strokeWidth="3"/>
                <polygon points="240,95 250,100 240,105" fill="#3B82F6"/>
                <text x="225" y="90" fill="#3B82F6" fontSize="14" fontWeight="bold">I</text>
                
                <text x="150" y="160" fill="#9CA3AF" fontSize="12" textAnchor="middle">Energy converted to heat</text>
              </svg>
            </div>
          ),
          symbols: [
            { symbol: "P", meaning: "Power (Watts, W)" },
            { symbol: "V", meaning: "Voltage (Volts, V)" },
            { symbol: "I", meaning: "Current (Amperes, A)" },
            { symbol: "R", meaning: "Resistance (Ohms, Ω)" }
          ],
          sampleProblem: {
            question: "A 240V electric kettle draws 8A of current. Calculate the power consumed and the resistance of the heating element.",
            given: [
              "V = 240 V (voltage)",
              "I = 8 A (current)"
            ],
            unknown: [
              "P = ? (power)",
              "R = ? (resistance)"
            ],
            solution: [
              "Step 1: Calculate power using P = VI",
              "P = V × I",
              "P = 240 V × 8 A",
              "P = 1,920 W = 1.92 kW",
              "",
              "Step 2: Calculate resistance using Ohm's Law",
              "R = V/I",
              "R = 240 V / 8 A",
              "R = 30 Ω"
            ],
            conclusion: "The kettle consumes 1,920 Watts (1.92 kW) of power and has a heating element resistance of 30 Ohms. This power is converted to heat to boil water."
          }
        },
        {
          id: "coulombs-law",
          title: "Coulomb's Law",
          formula: "F = kq₁q₂/r²",
          definition: "The electric force between two point charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them. Like charges repel, unlike charges attract.",
          realLife: [
            "Static electricity - charged balloon sticks to wall",
            "Lightning - massive charge separation creates powerful electric force",
            "Dust attraction to TV screens - static charges pull dust particles"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Electric Force Between Charges
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Like charges repel */}
                <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                  <p className="text-center font-bold text-red-400 mb-4">Like Charges REPEL</p>
                  <svg viewBox="0 0 200 100" className="w-full h-auto">
                    <circle cx="50" cy="50" r="20" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
                    <text x="50" y="55" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
                    
                    <circle cx="150" cy="50" r="20" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
                    <text x="150" y="55" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
                    
                    {/* Repulsion arrows */}
                    <line x1="70" y1="50" x2="50" y2="50" stroke="#FBBF24" strokeWidth="3"/>
                    <polygon points="50,50 58,45 58,55" fill="#FBBF24"/>
                    
                    <line x1="130" y1="50" x2="150" y2="50" stroke="#FBBF24" strokeWidth="3"/>
                    <polygon points="150,50 142,45 142,55" fill="#FBBF24"/>
                    
                    <text x="100" y="30" fill="#FBBF24" fontSize="14" fontWeight="bold" textAnchor="middle">F</text>
                    <text x="100" y="80" fill="#9CA3AF" fontSize="12" textAnchor="middle">r</text>
                  </svg>
                </div>
                
                {/* Unlike charges attract */}
                <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                  <p className="text-center font-bold text-green-400 mb-4">Unlike Charges ATTRACT</p>
                  <svg viewBox="0 0 200 100" className="w-full h-auto">
                    <circle cx="50" cy="50" r="20" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
                    <text x="50" y="55" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
                    
                    <circle cx="150" cy="50" r="20" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
                    <text x="150" y="60" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">-</text>
                    
                    {/* Attraction arrows */}
                    <line x1="70" y1="50" x2="90" y2="50" stroke="#22C55E" strokeWidth="3"/>
                    <polygon points="90,50 82,45 82,55" fill="#22C55E"/>
                    
                    <line x1="130" y1="50" x2="110" y2="50" stroke="#22C55E" strokeWidth="3"/>
                    <polygon points="110,50 118,45 118,55" fill="#22C55E"/>
                    
                    <text x="100" y="30" fill="#22C55E" fontSize="14" fontWeight="bold" textAnchor="middle">F</text>
                    <text x="100" y="80" fill="#9CA3AF" fontSize="12" textAnchor="middle">r</text>
                  </svg>
                </div>
              </div>
              
              <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/30 text-center">
                <p className="text-purple-400 font-bold mb-2">Inverse Square Law:</p>
                <p className="text-2xl font-mono text-purple-300">F ∝ 1/r²</p>
                <p className="text-sm text-gray-400 mt-2">Double the distance → Force becomes 1/4</p>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "F", meaning: "Electric Force (Newtons, N)" },
            { symbol: "k", meaning: "Coulomb's constant (9×10⁹ N⋅m²/C²)" },
            { symbol: "q₁, q₂", meaning: "Charges (Coulombs, C)" },
            { symbol: "r", meaning: "Distance between charges (meters, m)" }
          ],
          sampleProblem: {
            question: "Two point charges, +3μC and +5μC, are placed 0.2m apart. Calculate the electric force between them. (k = 9×10⁹ N⋅m²/C²)",
            given: [
              "q₁ = 3μC = 3×10⁻⁶ C",
              "q₂ = 5μC = 5×10⁻⁶ C",
              "r = 0.2 m",
              "k = 9×10⁹ N⋅m²/C²"
            ],
            unknown: [
              "F = ? (electric force)"
            ],
            solution: [
              "Step 1: Apply Coulomb's Law",
              "F = kq₁q₂/r²",
              "",
              "Step 2: Substitute values",
              "F = (9×10⁹)(3×10⁻⁶)(5×10⁻⁶) / (0.2)²",
              "F = (9×10⁹)(15×10⁻¹²) / 0.04",
              "F = 135×10⁻³ / 0.04",
              "F = 3.375 N"
            ],
            conclusion: "The electric force between the two charges is 3.375 N. Since both charges are positive, they repel each other with this force."
          }
        },

        {
          id: "resistors-series",
          title: "Resistors in Series",
          formula: "Rs = R₁ + R₂ + R₃",
          definition: "When resistors are connected in series, the total resistance is the sum of individual resistances. Current is the same through all resistors, but voltage divides across them.",
          realLife: [
            "Christmas lights - if one bulb fails, all lights go out",
            "Extension cords - longer cords have more resistance",
            "Battery cells in series - voltages add up"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Series Connection
              </h4>
              
              <svg viewBox="0 0 400 200" className="w-full h-auto">
                <defs>
                  <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#EF4444"/>
                  </marker>
                </defs>
                
                {/* Battery */}
                <line x1="30" y1="80" x2="30" y2="120" stroke="#22C55E" strokeWidth="6"/>
                <line x1="40" y1="85" x2="40" y2="115" stroke="#22C55E" strokeWidth="4"/>
                <text x="15" y="105" fill="#22C55E" fontSize="14" fontWeight="bold">+</text>
                <text x="45" y="60" fill="#9CA3AF" fontSize="12">V</text>
                
                {/* Wire segments */}
                <line x1="40" y1="100" x2="80" y2="100" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="130" y1="100" x2="170" y2="100" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="220" y1="100" x2="260" y2="100" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="310" y1="100" x2="370" y2="100" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="370" y1="100" x2="370" y2="150" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="370" y1="150" x2="30" y2="150" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="30" y1="150" x2="30" y2="120" stroke="#FBBF24" strokeWidth="3"/>
                
                {/* R1 */}
                <rect x="80" y="85" width="50" height="30" fill="none" stroke="#3B82F6" strokeWidth="2" rx="4"/>
                <path d="M 90 100 L 95 92 L 100 108 L 105 92 L 110 108 L 115 92 L 120 100" 
                      fill="none" stroke="#3B82F6" strokeWidth="2"/>
                <text x="105" y="135" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">R₁</text>
                
                {/* R2 */}
                <rect x="170" y="85" width="50" height="30" fill="none" stroke="#3B82F6" strokeWidth="2" rx="4"/>
                <path d="M 180 100 L 185 92 L 190 108 L 195 92 L 200 108 L 205 92 L 210 100" 
                      fill="none" stroke="#3B82F6" strokeWidth="2"/>
                <text x="195" y="135" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">R₂</text>
                
                {/* R3 */}
                <rect x="260" y="85" width="50" height="30" fill="none" stroke="#3B82F6" strokeWidth="2" rx="4"/>
                <path d="M 270 100 L 275 92 L 280 108 L 285 92 L 290 108 L 295 92 L 300 100" 
                      fill="none" stroke="#3B82F6" strokeWidth="2"/>
                <text x="285" y="135" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">R₃</text>
                
                {/* Current arrows */}
                <line x1="340" y1="100" x2="350" y2="100" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrowRed)"/>
                <text x="340" y="90" fill="#EF4444" fontSize="12" fontWeight="bold">I</text>
              </svg>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <p className="text-center font-bold text-blue-400 mb-2">Current</p>
                  <p className="text-center text-lg text-blue-300">Same everywhere</p>
                  <p className="text-center text-sm text-gray-400 mt-1">I = I₁ = I₂ = I₃</p>
                </div>
                
                <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                  <p className="text-center font-bold text-purple-400 mb-2">Voltage</p>
                  <p className="text-center text-lg text-purple-300">Divides across</p>
                  <p className="text-center text-sm text-gray-400 mt-1">V = V₁ + V₂ + V₃</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "Rs", meaning: "Total series resistance (Ohms, Ω)" },
            { symbol: "R₁, R₂, R₃", meaning: "Individual resistances (Ω)" }
          ],
          sampleProblem: {
            question: "Three resistors of 2Ω, 3Ω, and 5Ω are connected in series to a 20V battery. Find (a) total resistance, (b) current, and (c) voltage across each resistor.",
            given: [
              "R₁ = 2 Ω",
              "R₂ = 3 Ω", 
              "R₃ = 5 Ω",
              "V = 20 V"
            ],
            unknown: [
              "Rs = ? (total resistance)",
              "I = ? (current)",
              "V₁, V₂, V₃ = ? (voltage drops)"
            ],
            solution: [
              "Step 1: Calculate total resistance",
              "Rs = R₁ + R₂ + R₃",
              "Rs = 2 + 3 + 5 = 10 Ω",
              "",
              "Step 2: Calculate current using Ohm's Law",
              "I = V/Rs = 20/10 = 2 A",
              "",
              "Step 3: Calculate voltage across each resistor",
              "V₁ = IR₁ = 2 × 2 = 4 V",
              "V₂ = IR₂ = 2 × 3 = 6 V",
              "V₃ = IR₃ = 2 × 5 = 10 V"
            ],
            conclusion: "Total resistance is 10Ω with 2A current flowing through all resistors. Voltage drops are 4V, 6V, and 10V respectively, which sum to 20V (confirming Kirchhoff's Voltage Law)."
          }
        },

        {
          id: "resistors-parallel",
          title: "Resistors in Parallel",
          formula: "1/Rp = 1/R₁ + 1/R₂ + 1/R₃",
          definition: "When resistors are connected in parallel, the reciprocal of total resistance equals the sum of reciprocals of individual resistances. Voltage is same across all, but current divides.",
          realLife: [
            "Home electrical outlets - all get 220V independently",
            "Car headlights - each works independently",
            "Parallel battery banks - increase current capacity"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Parallel Connection
              </h4>
              
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                <defs>
                  <marker id="arrowOrange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#F97316"/>
                  </marker>
                </defs>
                
                {/* Battery */}
                <line x1="30" y1="100" x2="30" y2="140" stroke="#22C55E" strokeWidth="6"/>
                <line x1="40" y1="105" x2="40" y2="135" stroke="#22C55E" strokeWidth="4"/>
                <text x="15" y="125" fill="#22C55E" fontSize="14" fontWeight="bold">+</text>
                <text x="45" y="80" fill="#9CA3AF" fontSize="12">V</text>
                
                {/* Main wires */}
                <line x1="40" y1="120" x2="80" y2="120" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="300" y1="120" x2="350" y2="120" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="350" y1="120" x2="350" y2="200" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="350" y1="200" x2="30" y2="200" stroke="#FBBF24" strokeWidth="3"/>
                <line x1="30" y1="200" x2="30" y2="140" stroke="#FBBF24" strokeWidth="3"/>
                
                {/* Branch points */}
                <circle cx="80" cy="120" r="3" fill="#FBBF24"/>
                <circle cx="300" cy="120" r="3" fill="#FBBF24"/>
                
                {/* R1 branch (top) */}
                <line x1="80" y1="120" x2="80" y2="60" stroke="#FBBF24" strokeWidth="2"/>
                <line x1="80" y1="60" x2="300" y2="60" stroke="#FBBF24" strokeWidth="2"/>
                <line x1="300" y1="60" x2="300" y2="120" stroke="#FBBF24" strokeWidth="2"/>
                <rect x="160" y="45" width="60" height="30" fill="none" stroke="#EF4444" strokeWidth="2" rx="4"/>
                <text x="190" y="65" fill="#EF4444" fontSize="14" fontWeight="bold" textAnchor="middle">R₁</text>
                <text x="240" y="55" fill="#F97316" fontSize="11" fontWeight="bold">I₁</text>
                
                {/* R2 branch (middle) */}
                <line x1="80" y1="120" x2="300" y2="120" stroke="#FBBF24" strokeWidth="2"/>
                <rect x="160" y="105" width="60" height="30" fill="none" stroke="#3B82F6" strokeWidth="2" rx="4"/>
                <text x="190" y="125" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">R₂</text>
                <text x="240" y="115" fill="#F97316" fontSize="11" fontWeight="bold">I₂</text>
                
                {/* R3 branch (bottom) */}
                <line x1="80" y1="120" x2="80" y2="180" stroke="#FBBF24" strokeWidth="2"/>
                <line x1="80" y1="180" x2="300" y2="180" stroke="#FBBF24" strokeWidth="2"/>
                <line x1="300" y1="180" x2="300" y2="120" stroke="#FBBF24" strokeWidth="2"/>
                <rect x="160" y="165" width="60" height="30" fill="none" stroke="#22C55E" strokeWidth="2" rx="4"/>
                <text x="190" y="185" fill="#22C55E" fontSize="14" fontWeight="bold" textAnchor="middle">R₃</text>
                <text x="240" y="175" fill="#F97316" fontSize="11" fontWeight="bold">I₃</text>
                
                {/* Total current */}
                <line x1="50" y1="120" x2="70" y2="120" stroke="#F97316" strokeWidth="2" markerEnd="url(#arrowOrange)"/>
                <text x="55" y="110" fill="#F97316" fontSize="13" fontWeight="bold">I</text>
              </svg>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                  <p className="text-center font-bold text-green-400 mb-2">Voltage</p>
                  <p className="text-center text-lg text-green-300">Same across all</p>
                  <p className="text-center text-sm text-gray-400 mt-1">V = V₁ = V₂ = V₃</p>
                </div>
                
                <div className="p-4 bg-orange-900/20 rounded-xl border border-orange-500/30">
                  <p className="text-center font-bold text-orange-400 mb-2">Current</p>
                  <p className="text-center text-lg text-orange-300">Divides at branches</p>
                  <p className="text-center text-sm text-gray-400 mt-1">I = I₁ + I₂ + I₃</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "Rp", meaning: "Total parallel resistance (Ohms, Ω)" },
            { symbol: "R₁, R₂, R₃", meaning: "Individual resistances (Ω)" }
          ],
          sampleProblem: {
            question: "Three resistors of 6Ω, 3Ω, and 2Ω are connected in parallel to a 12V battery. Find (a) total resistance and (b) current through each resistor.",
            given: [
              "R₁ = 6 Ω",
              "R₂ = 3 Ω",
              "R₃ = 2 Ω",
              "V = 12 V"
            ],
            unknown: [
              "Rp = ? (total resistance)",
              "I₁, I₂, I₃ = ? (individual currents)"
            ],
            solution: [
              "Step 1: Calculate total resistance",
              "1/Rp = 1/R₁ + 1/R₂ + 1/R₃",
              "1/Rp = 1/6 + 1/3 + 1/2",
              "1/Rp = 1/6 + 2/6 + 3/6 = 6/6 = 1",
              "Rp = 1 Ω",
              "",
              "Step 2: Calculate current through each (V same = 12V)",
              "I₁ = V/R₁ = 12/6 = 2 A",
              "I₂ = V/R₂ = 12/3 = 4 A",
              "I₃ = V/R₃ = 12/2 = 6 A",
              "Total: I = 2 + 4 + 6 = 12 A"
            ],
            conclusion: "Total parallel resistance is 1Ω (less than smallest individual resistor). Currents are 2A, 4A, and 6A, totaling 12A from the battery."
          }
        },

        {
          id: "capacitance",
          title: "Capacitance",
          formula: "C = Q/V",
          definition: "Capacitance is the ability of a system to store electric charge. A capacitor stores energy in an electric field between two conductors. One farad is the capacitance that stores one coulomb at one volt.",
          realLife: [
            "Camera flash - capacitor stores charge then releases quickly",
            "Power supplies - smooths out voltage fluctuations",
            "Touchscreens - detect finger position through capacitance change"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Capacitor Charging
              </h4>
              
              <svg viewBox="0 0 350 200" className="w-full h-auto">
                {/* Capacitor plates */}
                <rect x="140" y="50" width="10" height="100" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
                <rect x="200" y="50" width="10" height="100" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
                
                {/* Charges on left plate (positive) */}
                <text x="125" y="70" fill="#22C55E" fontSize="18" fontWeight="bold">+</text>
                <text x="125" y="95" fill="#22C55E" fontSize="18" fontWeight="bold">+</text>
                <text x="125" y="120" fill="#22C55E" fontSize="18" fontWeight="bold">+</text>
                <text x="125" y="145" fill="#22C55E" fontSize="18" fontWeight="bold">+</text>
                
                {/* Charges on right plate (negative) */}
                <text x="215" y="75" fill="#EF4444" fontSize="22" fontWeight="bold">−</text>
                <text x="215" y="100" fill="#EF4444" fontSize="22" fontWeight="bold">−</text>
                <text x="215" y="125" fill="#EF4444" fontSize="22" fontWeight="bold">−</text>
                <text x="215" y="150" fill="#EF4444" fontSize="22" fontWeight="bold">−</text>
                
                {/* Electric field lines */}
                {[60, 80, 100, 120, 140].map((y, i) => (
                  <line key={i} x1="150" y1={y} x2="200" y2={y} stroke="#FBBF24" strokeWidth="1" strokeDasharray="3,3"/>
                ))}
                <text x="175" y="45" fill="#FBBF24" fontSize="12" fontWeight="bold" textAnchor="middle">E field</text>
                
                {/* Labels */}
                <text x="145" y="175" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">+Q</text>
                <text x="205" y="175" fill="#EF4444" fontSize="14" fontWeight="bold" textAnchor="middle">−Q</text>
                <text x="175" y="190" fill="#9CA3AF" fontSize="12" textAnchor="middle">Charge stored</text>
                
                {/* Voltage indicator */}
                <line x1="145" y1="30" x2="205" y2="30" stroke="#A855F7" strokeWidth="2"/>
                <line x1="145" y1="25" x2="145" y2="35" stroke="#A855F7" strokeWidth="2"/>
                <line x1="205" y1="25" x2="205" y2="35" stroke="#A855F7" strokeWidth="2"/>
                <text x="175" y="20" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">V</text>
              </svg>
              
              <div className="p-4 bg-cyan-900/20 rounded-xl border border-cyan-500/30">
                <p className="text-center text-cyan-400 font-bold mb-3">Energy Stored in Capacitor:</p>
                <p className="text-center text-2xl font-mono text-cyan-300">E = ½CV² = ½QV</p>
                <p className="text-center text-sm text-gray-400 mt-2">Energy stored in electric field</p>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "C", meaning: "Capacitance (Farads, F)" },
            { symbol: "Q", meaning: "Charge stored (Coulombs, C)" },
            { symbol: "V", meaning: "Voltage across capacitor (Volts, V)" }
          ],
          sampleProblem: {
            question: "A capacitor stores 0.01C of charge when connected to a 50V battery. Calculate (a) the capacitance and (b) energy stored.",
            given: [
              "Q = 0.01 C (charge stored)",
              "V = 50 V (voltage)"
            ],
            unknown: [
              "C = ? (capacitance)",
              "E = ? (energy stored)"
            ],
            solution: [
              "Step 1: Calculate capacitance",
              "C = Q/V",
              "C = 0.01 C / 50 V",
              "C = 0.0002 F = 200 μF",
              "",
              "Step 2: Calculate energy stored",
              "E = ½QV",
              "E = ½ × 0.01 × 50",
              "E = 0.25 J"
            ],
            conclusion: "The capacitance is 200 microfarads (200 μF), storing 0.25 Joules of energy in its electric field. This energy can be released quickly when needed."
          }
        },

        {
          id: "faradays-law",
          title: "Faraday's Law of Induction",
          formula: "ε = -dΦ/dt",
          definition: "The induced electromotive force (EMF) in a circuit is equal to the negative rate of change of magnetic flux through the circuit. A changing magnetic field creates an electric field.",
          realLife: [
            "Electric generators - rotating coil in magnetic field produces electricity",
            "Induction cooktops - changing magnetic field heats metal cookware",
            "Wireless charging - changing current in transmitter induces current in receiver"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Electromagnetic Induction
              </h4>
              
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Magnet moving */}
                <rect x="50" y="90" width="80" height="60" fill="#EF4444" stroke="#DC2626" strokeWidth="2" rx="5"/>
                <text x="90" y="115" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">N</text>
                <text x="90" y="140" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">S</text>
                
                {/* Motion arrow */}
                <line x1="140" y1="120" x2="170" y2="120" stroke="#FBBF24" strokeWidth="3"/>
                <polygon points="170,120 162,115 162,125" fill="#FBBF24"/>
                <text x="155" y="110" fill="#FBBF24" fontSize="12" fontWeight="bold">v</text>
                
                {/* Coil */}
                <ellipse cx="250" cy="80" rx="40" ry="15" fill="none" stroke="#3B82F6" strokeWidth="3"/>
                <line x1="210" y1="80" x2="210" y2="160" stroke="#3B82F6" strokeWidth="3"/>
                <line x1="290" y1="80" x2="290" y2="160" stroke="#3B82F6" strokeWidth="3"/>
                <ellipse cx="250" cy="160" rx="40" ry="15" fill="none" stroke="#3B82F6" strokeWidth="3"/>
                
                {/* Induced current */}
                <line x1="290" y1="120" x2="330" y2="120" stroke="#22C55E" strokeWidth="2"/>
                <line x1="330" y1="120" x2="330" y2="170" stroke="#22C55E" strokeWidth="2"/>
                <circle cx="350" cy="145" r="15" fill="none" stroke="#22C55E" strokeWidth="2"/>
                <text x="350" y="150" fill="#22C55E" fontSize="12" fontWeight="bold" textAnchor="middle">G</text>
                <text x="340" y="200" fill="#22C55E" fontSize="11">Induced current</text>
                
                {/* Magnetic field lines */}
                <path d="M 130 105 Q 180 100, 220 100" fill="none" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,2"/>
                <path d="M 130 120 Q 180 120, 220 120" fill="none" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,2"/>
                <path d="M 130 135 Q 180 140, 220 140" fill="none" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,2"/>
                <text x="175" y="90" fill="#F97316" fontSize="11">Φ (flux)</text>
                
                <text x="200" y="230" fill="#9CA3AF" fontSize="12" textAnchor="middle">Changing flux induces EMF</text>
              </svg>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                  <p className="text-center font-bold text-red-400 mb-2">Magnetic Flux (Φ)</p>
                  <p className="text-center text-lg font-mono text-red-300">Φ = BA cos θ</p>
                  <p className="text-center text-xs text-gray-400 mt-1">Field × Area × cos(angle)</p>
                </div>
                
                <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                  <p className="text-center font-bold text-green-400 mb-2">Lenz's Law</p>
                  <p className="text-center text-sm text-green-300">Induced current opposes change</p>
                  <p className="text-center text-xs text-gray-400 mt-1">Negative sign in formula</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "ε", meaning: "Induced EMF (Volts, V)" },
            { symbol: "Φ", meaning: "Magnetic flux (Webers, Wb)" },
            { symbol: "t", meaning: "Time (seconds, s)" },
            { symbol: "dΦ/dt", meaning: "Rate of change of flux" }
          ],
          sampleProblem: {
            question: "A coil of 100 turns experiences a change in magnetic flux from 0.5 Wb to 0.1 Wb in 0.2 seconds. Calculate the induced EMF.",
            given: [
              "N = 100 turns",
              "Φ₁ = 0.5 Wb (initial flux)",
              "Φ₂ = 0.1 Wb (final flux)",
              "Δt = 0.2 s (time interval)"
            ],
            unknown: [
              "ε = ? (induced EMF)"
            ],
            solution: [
              "Step 1: Calculate change in flux",
              "ΔΦ = Φ₂ - Φ₁ = 0.1 - 0.5 = -0.4 Wb",
              "",
              "Step 2: Apply Faraday's Law (for N turns)",
              "ε = -N × (ΔΦ/Δt)",
              "ε = -100 × (-0.4/0.2)",
              "ε = -100 × (-2)",
              "ε = 200 V"
            ],
            conclusion: "The induced EMF is 200 Volts. The positive value indicates the induced current will oppose the decrease in magnetic flux (Lenz's Law)."
          }
        }
      ]
    },
    {
    title: "Visual Concepts",
    diagrams: [
      { 
        name: "Series Circuit",
        svg: (
          <svg viewBox="0 0 400 200" className="w-full h-auto">
            <defs>
              <marker id="seriesArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#EF4444"/>
              </marker>
            </defs>
            
            {/* Battery */}
            <line x1="30" y1="80" x2="30" y2="110" stroke="#22C55E" strokeWidth="6"/>
            <line x1="40" y1="85" x2="40" y2="105" stroke="#22C55E" strokeWidth="4"/>
            <text x="20" y="100" fill="#22C55E" fontSize="16" fontWeight="bold">+</text>
            <text x="15" y="70" fill="#9CA3AF" fontSize="12">Battery</text>
            
            {/* Top wire */}
            <line x1="40" y1="95" x2="90" y2="95" stroke="#FBBF24" strokeWidth="3"/>
            <line x1="140" y1="95" x2="190" y2="95" stroke="#FBBF24" strokeWidth="3"/>
            <line x1="240" y1="95" x2="290" y2="95" stroke="#FBBF24" strokeWidth="3"/>
            <line x1="340" y1="95" x2="370" y2="95" stroke="#FBBF24" strokeWidth="3"/>
            
            {/* Bottom wire */}
            <line x1="370" y1="95" x2="370" y2="145" stroke="#FBBF24" strokeWidth="3"/>
            <line x1="370" y1="145" x2="30" y2="145" stroke="#FBBF24" strokeWidth="3"/>
            <line x1="30" y1="145" x2="30" y2="110" stroke="#FBBF24" strokeWidth="3"/>
            
            {/* R1 */}
            <rect x="90" y="80" width="50" height="30" fill="none" stroke="#3B82F6" strokeWidth="2" rx="4"/>
            <text x="115" y="100" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">R₁</text>
            
            {/* R2 */}
            <rect x="190" y="80" width="50" height="30" fill="none" stroke="#3B82F6" strokeWidth="2" rx="4"/>
            <text x="215" y="100" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">R₂</text>
            
            {/* R3 */}
            <rect x="290" y="80" width="50" height="30" fill="none" stroke="#3B82F6" strokeWidth="2" rx="4"/>
            <text x="315" y="100" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">R₃</text>
            
            {/* Current indicator */}
            <line x1="350" y1="95" x2="360" y2="95" stroke="#EF4444" strokeWidth="2" markerEnd="url(#seriesArrow)"/>
            <text x="345" y="85" fill="#EF4444" fontSize="12" fontWeight="bold">I</text>
            
            {/* Label */}
            <text x="200" y="175" fill="#9CA3AF" fontSize="14" textAnchor="middle" fontWeight="bold">Same current through all</text>
          </svg>
        ),
        description: "In series: Current is same everywhere, voltage divides. Total resistance = R₁ + R₂ + R₃"
      },  
      { 
        name: "Parallel Circuit",
        svg: (
          <svg viewBox="0 0 450 280" className="w-full h-auto">
            <defs>
              <marker id="parallelArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#F97316"/>
              </marker>
            </defs>
            
            {/* Battery */}
            <line x1="50" y1="110" x2="50" y2="150" stroke="#22C55E" strokeWidth="8"/>
            <line x1="60" y1="115" x2="60" y2="145" stroke="#22C55E" strokeWidth="5"/>
            <text x="35" y="135" fill="#22C55E" fontSize="16" fontWeight="bold">+</text>
            <text x="30" y="95" fill="#9CA3AF" fontSize="13">Battery</text>
            
            {/* Left main vertical line */}
            <line x1="60" y1="130" x2="100" y2="130" stroke="#FBBF24" strokeWidth="4"/>
            <line x1="100" y1="50" x2="100" y2="210" stroke="#FBBF24" strokeWidth="4"/>
            
            {/* Right main vertical line */}
            <line x1="350" y1="50" x2="350" y2="210" stroke="#FBBF24" strokeWidth="4"/>
            <line x1="350" y1="130" x2="400" y2="130" stroke="#FBBF24" strokeWidth="4"/>
            
            {/* Bottom return line */}
            <line x1="400" y1="130" x2="400" y2="220" stroke="#FBBF24" strokeWidth="4"/>
            <line x1="400" y1="220" x2="50" y2="220" stroke="#FBBF24" strokeWidth="4"/>
            <line x1="50" y1="220" x2="50" y2="150" stroke="#FBBF24" strokeWidth="4"/>
            
            {/* Junction points */}
            <circle cx="100" cy="70" r="4" fill="#FBBF24"/>
            <circle cx="100" cy="130" r="4" fill="#FBBF24"/>
            <circle cx="100" cy="190" r="4" fill="#FBBF24"/>
            <circle cx="350" cy="70" r="4" fill="#FBBF24"/>
            <circle cx="350" cy="130" r="4" fill="#FBBF24"/>
            <circle cx="350" cy="190" r="4" fill="#FBBF24"/>
            
            {/* R1 branch (top) */}
            <line x1="100" y1="70" x2="180" y2="70" stroke="#FBBF24" strokeWidth="3"/>
            <rect x="180" y="55" width="80" height="30" fill="none" stroke="#EF4444" strokeWidth="3" rx="5"/>
            <text x="220" y="75" fill="#EF4444" fontSize="16" fontWeight="bold" textAnchor="middle">R₁</text>
            <line x1="260" y1="70" x2="350" y2="70" stroke="#FBBF24" strokeWidth="3"/>
            
            {/* R2 branch (middle) */}
            <line x1="100" y1="130" x2="180" y2="130" stroke="#FBBF24" strokeWidth="3"/>
            <rect x="180" y="115" width="80" height="30" fill="none" stroke="#3B82F6" strokeWidth="3" rx="5"/>
            <text x="220" y="135" fill="#3B82F6" fontSize="16" fontWeight="bold" textAnchor="middle">R₂</text>
            <line x1="260" y1="130" x2="350" y2="130" stroke="#FBBF24" strokeWidth="3"/>
            
            {/* R3 branch (bottom) */}
            <line x1="100" y1="190" x2="180" y2="190" stroke="#FBBF24" strokeWidth="3"/>
            <rect x="180" y="175" width="80" height="30" fill="none" stroke="#22C55E" strokeWidth="3" rx="5"/>
            <text x="220" y="195" fill="#22C55E" fontSize="16" fontWeight="bold" textAnchor="middle">R₃</text>
            <line x1="260" y1="190" x2="350" y2="190" stroke="#FBBF24" strokeWidth="3"/>
            
            {/* Current arrow */}
            <line x1="70" y1="130" x2="90" y2="130" stroke="#F97316" strokeWidth="3" markerEnd="url(#parallelArrow)"/>
            <text x="75" y="118" fill="#F97316" fontSize="14" fontWeight="bold">I</text>
            
            {/* Label */}
            <text x="225" y="260" fill="#9CA3AF" fontSize="15" textAnchor="middle" fontWeight="bold">Same voltage, current divides</text>
          </svg>
        ),
        description: "In parallel: Voltage is same across all, current divides. 1/R_total = 1/R₁ + 1/R₂ + 1/R₃"
      }, 
      { 
        name: "Magnetic Field Lines",
        svg: (
          <svg viewBox="0 0 350 200" className="w-full h-auto">
            {/* Bar magnet */}
            <rect x="100" y="70" width="60" height="60" fill="#EF4444" stroke="#DC2626" strokeWidth="2" rx="5"/>
            <text x="130" y="105" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">N</text>
            
            <rect x="190" y="70" width="60" height="60" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="5"/>
            <text x="220" y="105" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">S</text>
            
            {/* Field lines from N to S (outside) */}
            <path d="M 130 70 Q 130 30, 220 30 Q 220 50, 220 70" 
                  fill="none" stroke="#22C55E" strokeWidth="2" markerEnd="url(#fieldArrow)"/>
            <path d="M 120 70 Q 100 40, 240 40 Q 240 60, 230 70" 
                  fill="none" stroke="#22C55E" strokeWidth="2" markerEnd="url(#fieldArrow)"/>
            
            <path d="M 130 130 Q 130 170, 220 170 Q 220 150, 220 130" 
                  fill="none" stroke="#22C55E" strokeWidth="2" markerEnd="url(#fieldArrow)"/>
            <path d="M 120 130 Q 100 160, 240 160 Q 240 140, 230 130" 
                  fill="none" stroke="#22C55E" strokeWidth="2" markerEnd="url(#fieldArrow)"/>
            
            {/* Field line through magnet */}
            <line x1="160" y1="100" x2="190" y2="100" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4,4"/>
            <polygon points="185,100 177,96 177,104" fill="#FBBF24"/>
            
            <defs>
              <marker id="fieldArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#22C55E"/>
              </marker>
            </defs>
            
            {/* Labels */}
            <text x="70" y="30" fill="#22C55E" fontSize="12">Field lines</text>
            <text x="175" y="190" fill="#9CA3AF" fontSize="14" textAnchor="middle" fontWeight="bold">N → S (outside), S → N (inside)</text>
          </svg>
        ),
        description: "Magnetic field lines emerge from North pole and enter South pole, forming closed loops."
      },  
      { 
        name: "Right Hand Rule",
        svg: (
          <svg viewBox="0 0 400 280" className="w-full h-auto">
            <defs>
              <marker id="arrowCurrent" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#EF4444"/>
              </marker>
              <marker id="arrowField" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#3B82F6"/>
              </marker>
            </defs>
            
            {/* Palm base (larger circle) */}
            <ellipse cx="150" cy="140" rx="45" ry="50" fill="#FFB6C1" stroke="#DC2626" strokeWidth="2"/>
            
            {/* Thumb (pointing right - Current) */}
            <ellipse cx="210" cy="140" rx="35" ry="15" fill="#FFB6C1" stroke="#DC2626" strokeWidth="2"/>
            <path d="M 195 140 Q 220 135, 240 140 Q 220 145, 195 140" fill="#FFB6C1" stroke="#DC2626" strokeWidth="2"/>
            
            {/* Thumb arrow and label */}
            <line x1="245" y1="140" x2="280" y2="140" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrowCurrent)"/>
            <text x="260" y="125" fill="#EF4444" fontSize="15" fontWeight="bold" textAnchor="middle">Thumb</text>
            <text x="260" y="165" fill="#EF4444" fontSize="13" textAnchor="middle">Current (I)</text>
            
            {/* Four fingers pointing up (Field) */}
            <rect x="110" y="60" width="15" height="40" fill="#FFB6C1" stroke="#DC2626" strokeWidth="2" rx="7"/>
            <rect x="130" y="50" width="15" height="50" fill="#FFB6C1" stroke="#DC2626" strokeWidth="2" rx="7"/>
            <rect x="150" y="55" width="15" height="45" fill="#FFB6C1" stroke="#DC2626" strokeWidth="2" rx="7"/>
            <rect x="170" y="60" width="15" height="40" fill="#FFB6C1" stroke="#DC2626" strokeWidth="2" rx="7"/>
            
            {/* Finger joints (small ovals) */}
            <ellipse cx="117" cy="75" rx="7" ry="4" fill="#FFB6C1" stroke="#DC2626" strokeWidth="1"/>
            <ellipse cx="137" cy="70" rx="7" ry="4" fill="#FFB6C1" stroke="#DC2626" strokeWidth="1"/>
            <ellipse cx="157" cy="72" rx="7" ry="4" fill="#FFB6C1" stroke="#DC2626" strokeWidth="1"/>
            <ellipse cx="177" cy="75" rx="7" ry="4" fill="#FFB6C1" stroke="#DC2626" strokeWidth="1"/>
            
            {/* Finger arrow and label */}
            <line x1="145" y1="45" x2="145" y2="15" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowField)"/>
            <text x="145" y="10" fill="#3B82F6" fontSize="15" fontWeight="bold" textAnchor="middle">Fingers</text>
            <text x="200" y="35" fill="#3B82F6" fontSize="13" textAnchor="middle">Field (B)</text>
            
            {/* Palm center - Force out of page (dot in circle) */}
            <circle cx="150" cy="145" r="18" fill="none" stroke="#22C55E" strokeWidth="3"/>
            <circle cx="150" cy="145" r="4" fill="#22C55E"/>
            
            {/* Palm label */}
            <text x="150" y="185" fill="#22C55E" fontSize="15" fontWeight="bold" textAnchor="middle">Palm</text>
            <text x="150" y="202" fill="#22C55E" fontSize="13" textAnchor="middle">Force (F)</text>
            <text x="150" y="218" fill="#22C55E" fontSize="11" textAnchor="middle">⊙ out of page</text>
            
            {/* Formula box */}
            <rect x="240" y="180" width="140" height="70" fill="none" stroke="#A855F7" strokeWidth="2" rx="8"/>
            <text x="310" y="205" fill="#A855F7" fontSize="16" fontWeight="bold" textAnchor="middle">F = I L × B</text>
            <text x="310" y="225" fill="#9CA3AF" fontSize="11" textAnchor="middle">Force perpendicular</text>
            <text x="310" y="240" fill="#9CA3AF" fontSize="11" textAnchor="middle">to both I and B</text>
            
            {/* Bottom label */}
            <text x="200" y="270" fill="#9CA3AF" fontSize="14" textAnchor="middle" fontWeight="bold">Fleming's Left Hand Rule (Motor)</text>
          </svg>
        ),
        description: "Thumb = Current direction, Fingers = Magnetic field, Palm = Force direction (Fleming's Left Hand Rule)"
      }
    ]
  },
    {
      title: "Key Laws & Principles",
      expandableLaws: [
        {
          id: "ohms-law-principle",
          title: "Ohm's Law",
          formula: "V = IR",
          definition: "The current through a conductor is directly proportional to the voltage across it and inversely proportional to its resistance. This fundamental law applies to ohmic materials at constant temperature.",
          realLife: [
            "Dimmer switches - adjusting resistance changes current, controlling light brightness",
            "Phone chargers - regulate voltage and resistance to control charging current",
            "Electric heaters - higher resistance wire produces more heat with same voltage"
          ],
          visual: (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-bold mb-4">V = I × R</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-blue-900/30 rounded-lg">
                    <p className="font-bold text-blue-400">↑ Voltage</p>
                    <p className="text-gray-300">→ ↑ Current</p>
                  </div>
                  <div className="p-3 bg-red-900/30 rounded-lg">
                    <p className="font-bold text-red-400">↑ Resistance</p>
                    <p className="text-gray-300">→ ↓ Current</p>
                  </div>
                  <div className="p-3 bg-green-900/30 rounded-lg">
                    <p className="font-bold text-green-400">Fixed V</p>
                    <p className="text-gray-300">I ∝ 1/R</p>
                  </div>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "V", meaning: "Voltage/Potential Difference (Volts, V)" },
            { symbol: "I", meaning: "Current (Amperes, A)" },
            { symbol: "R", meaning: "Resistance (Ohms, Ω)" }
          ],
          sampleProblem: {
            question: "A 12V battery is connected to a 3Ω resistor. Calculate the current flowing through the circuit.",
            given: [
              "V = 12 V (voltage)",
              "R = 3 Ω (resistance)"
            ],
            unknown: [
              "I = ? (current)"
            ],
            solution: [
              "Step 1: Apply Ohm's Law",
              "V = IR",
              "",
              "Step 2: Rearrange for I",
              "I = V/R",
              "",
              "Step 3: Substitute values",
              "I = 12 V / 3 Ω",
              "I = 4 A"
            ],
            conclusion: "The current flowing through the circuit is 4 Amperes. This current is determined by the voltage of the battery and the resistance of the resistor."
          },
          keyPoints: [
            "Only applies to ohmic conductors (metals at constant temperature)",
            "Resistance stays constant regardless of voltage/current",
            "Graph of V vs I is a straight line through origin"
          ]
        },
        {
          id: "kirchhoffs-current",
          title: "Kirchhoff's Current Law (KCL)",
          formula: "ΣI_in = ΣI_out",
          definition: "The algebraic sum of currents entering a junction (node) equals the sum of currents leaving. This is based on the conservation of electric charge - charge cannot accumulate at a junction.",
          realLife: [
            "Household wiring - current splits at junction boxes to different rooms",
            "Parallel circuits - total current from battery equals sum of branch currents",
            "Circuit breakers - monitor total current flowing through junction points"
          ],
          visual: (
            <div className="space-y-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <p className="font-bold mb-3">Junction Example:</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-green-400 text-2xl">→ 5A</span>
                    <span className="text-xs text-gray-400">In</span>
                  </div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-xl">→ 2A</span>
                      <span className="text-xs text-gray-400">Out</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-xl">→ 3A</span>
                      <span className="text-xs text-gray-400">Out</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-300">5A in = 2A + 3A out ✓</p>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "ΣI_in", meaning: "Sum of currents entering junction (Amperes)" },
            { symbol: "ΣI_out", meaning: "Sum of currents leaving junction (Amperes)" }
          ],
          sampleProblem: {
            question: "At a circuit junction, three wires meet. Currents of 4A and 3A enter the junction, while 2A leaves through one wire. Find the current in the third wire.",
            given: [
              "I_in1 = 4 A",
              "I_in2 = 3 A", 
              "I_out1 = 2 A"
            ],
            unknown: [
              "I_out2 = ? (current in third wire)"
            ],
            solution: [
              "Step 1: Apply Kirchhoff's Current Law",
              "ΣI_in = ΣI_out",
              "4A + 3A = 2A + I_out2",
              "",
              "Step 2: Solve for I_out2",
              "7A = 2A + I_out2",
              "I_out2 = 7A - 2A = 5A"
            ],
            conclusion: "The current in the third wire is 5A leaving the junction, satisfying charge conservation."
          },
          keyPoints: [
            "Based on conservation of charge",
            "Current cannot accumulate at a point",
            "Used to analyze parallel circuits"
          ]
        },
        {
          id: "kirchhoffs-voltage",
          title: "Kirchhoff's Voltage Law (KVL)",
          formula: "ΣV = 0 (around closed loop)",
          definition: "The algebraic sum of all voltages around any closed loop in a circuit equals zero. This is based on conservation of energy - energy gained from sources equals energy lost in loads.",
          realLife: [
            "Series Christmas lights - sum of voltage drops equals battery voltage",
            "Car electrical system - alternator voltage balances all component voltages",
            "Voltage divider circuits - distribute voltage across multiple components"
          ],
          visual: (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-center mb-4">Series Circuit Loop:</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-green-400 font-bold">+12V</div>
                  <span className="text-gray-400">→</span>
                  <div className="text-red-400">-4V</div>
                  <span className="text-gray-400">→</span>
                  <div className="text-red-400">-5V</div>
                  <span className="text-gray-400">→</span>
                  <div className="text-red-400">-3V</div>
                </div>
                <p className="mt-3 text-sm text-center text-gray-300">
                  +12V - 4V - 5V - 3V = 0 ✓
                </p>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "ΣV", meaning: "Sum of all voltages in closed loop (Volts)" }
          ],
          sampleProblem: {
            question: "In a series circuit with a 9V battery, there are voltage drops of 2V, 3V, and Vₓ across three resistors. Find Vₓ using KVL.",
            given: [
              "V_battery = 9 V",
              "V₁ = 2 V",
              "V₂ = 3 V",
              "Vₓ = ?"
            ],
            unknown: [
              "Vₓ = ? (unknown voltage drop)"
            ],
            solution: [
              "Step 1: Apply Kirchhoff's Voltage Law",
              "ΣV = 0 around closed loop",
              "V_battery - V₁ - V₂ - Vₓ = 0",
              "",
              "Step 2: Substitute values",
              "9V - 2V - 3V - Vₓ = 0",
              "4V - Vₓ = 0",
              "",
              "Step 3: Solve for Vₓ",
              "Vₓ = 4V"
            ],
            conclusion: "The unknown voltage drop Vₓ is 4V, making the total voltage drops equal to the battery voltage (2V + 3V + 4V = 9V)."
          },
          keyPoints: [
            "Based on conservation of energy",
            "Voltage rises = Voltage drops in any loop",
            "Used to analyze series circuits"
          ]
        },
        {
          id: "coulombs-law",
          title: "Coulomb's Law",
          formula: "F = k(q₁q₂)/r²",
          definition: "The electrostatic force between two point charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them. k = 9×10⁹ N·m²/C²",
          realLife: [
            "Static electricity - clothes clinging after dryer due to opposite charges",
            "Lightning - massive charge separation creates enormous force",
            "Photocopiers - charged toner particles attracted to oppositely charged paper"
          ],
          visual: (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex justify-around items-center mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">+</div>
                    <p className="text-xs text-blue-400 mt-1">q₁</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-red-400 text-2xl">←→</span>
                    <span className="text-xs text-gray-400">r</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">-</div>
                    <p className="text-xs text-red-400 mt-1">q₂</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-green-900/30 rounded">
                    <p className="text-green-400 font-bold">Like charges</p>
                    <p className="text-gray-300">Repel (+ +) or (- -)</p>
                  </div>
                  <div className="p-2 bg-blue-900/30 rounded">
                    <p className="text-blue-400 font-bold">Unlike charges</p>
                    <p className="text-gray-300">Attract (+ -)</p>
                  </div>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "F", meaning: "Electric Force (Newtons, N)" },
            { symbol: "k", meaning: "Coulomb's constant (9×10⁹ N⋅m²/C²)" },
            { symbol: "q₁, q₂", meaning: "Charges (Coulombs, C)" },
            { symbol: "r", meaning: "Distance between charges (meters, m)" }
          ],
          sampleProblem: {
            question: "Two point charges, +3μC and +5μC, are placed 0.2m apart. Calculate the electric force between them.",
            given: [
              "q₁ = 3μC = 3×10⁻⁶ C",
              "q₂ = 5μC = 5×10⁻⁶ C",
              "r = 0.2 m",
              "k = 9×10⁹ N⋅m²/C²"
            ],
            unknown: [
              "F = ? (electric force)"
            ],
            solution: [
              "Step 1: Apply Coulomb's Law",
              "F = kq₁q₂/r²",
              "",
              "Step 2: Substitute values",
              "F = (9×10⁹)(3×10⁻⁶)(5×10⁻⁶) / (0.2)²",
              "F = (9×10⁹)(15×10⁻¹²) / 0.04",
              "F = 135×10⁻³ / 0.04",
              "F = 3.375 N"
            ],
            conclusion: "The electric force between the two charges is 3.375 N. Since both charges are positive, they repel each other with this force."
          },
          keyPoints: [
            "Inverse square law (double distance = 1/4 force)",
            "Like charges repel, unlike charges attract",
            "Works for point charges or spherically symmetric distributions"
          ]
        },
        {
          id: "faradays-law",
          title: "Faraday's Law of Induction",
          formula: "ε = -dΦ/dt",
          definition: "A changing magnetic flux through a circuit induces an electromotive force (EMF) in the circuit. The magnitude of induced EMF is proportional to the rate of change of magnetic flux. This is the principle behind electric generators.",
          realLife: [
            "Electric generators - rotating magnets induce current in coils",
            "Transformers - changing current in primary coil induces voltage in secondary",
            "Induction cooktops - changing magnetic field induces currents in metal cookware"
          ],
          visual: (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-center mb-3">Magnetic Flux Change → Induced EMF</p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-purple-900/30 rounded text-center">
                    <p className="text-purple-400 font-bold mb-1">Moving Magnet</p>
                    <p className="text-gray-300">↕️ → Induced I</p>
                  </div>
                  <div className="p-3 bg-pink-900/30 rounded text-center">
                    <p className="text-pink-400 font-bold mb-1">Rotating Coil</p>
                    <p className="text-gray-300">🔄 → Induced I</p>
                  </div>
                  <div className="p-3 bg-blue-900/30 rounded text-center">
                    <p className="text-blue-400 font-bold mb-1">Changing B</p>
                    <p className="text-gray-300">ΔB → Induced I</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-center text-gray-300">
                  Faster change = Larger induced EMF
                </p>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "ε", meaning: "Induced EMF (Volts, V)" },
            { symbol: "Φ", meaning: "Magnetic flux (Webers, Wb)" },
            { symbol: "t", meaning: "Time (seconds, s)" },
            { symbol: "dΦ/dt", meaning: "Rate of change of flux" }
          ],
          sampleProblem: {
            question: "A coil of 100 turns experiences a change in magnetic flux from 0.5 Wb to 0.1 Wb in 0.2 seconds. Calculate the induced EMF.",
            given: [
              "N = 100 turns",
              "Φ₁ = 0.5 Wb (initial flux)",
              "Φ₂ = 0.1 Wb (final flux)",
              "Δt = 0.2 s (time interval)"
            ],
            unknown: [
              "ε = ? (induced EMF)"
            ],
            solution: [
              "Step 1: Calculate change in flux",
              "ΔΦ = Φ₂ - Φ₁ = 0.1 - 0.5 = -0.4 Wb",
              "",
              "Step 2: Apply Faraday's Law (for N turns)",
              "ε = -N × (ΔΦ/Δt)",
              "ε = -100 × (-0.4/0.2)",
              "ε = -100 × (-2)",
              "ε = 200 V"
            ],
            conclusion: "The induced EMF is 200 Volts. The positive value indicates the induced current will oppose the decrease in magnetic flux (Lenz's Law)."
          },
          keyPoints: [
            "Only CHANGING magnetic flux induces EMF (static field = no induction)",
            "Negative sign indicates direction (Lenz's law)",
            "Basis of all electric generators and transformers"
          ]
        },
        {
          id: "lenzs-law",
          title: "Lenz's Law",
          formula: "Direction: Opposes change",
          definition: "The direction of an induced current is always such that it opposes the change in magnetic flux that produced it. This is a consequence of energy conservation - if induced current aided the change, we'd get perpetual motion.",
          realLife: [
            "Eddy current brakes - induced currents oppose motion, providing smooth braking",
            "Metal detectors - induced currents create opposing field detected by sensor",
            "Magnetic damping - moving magnet slows down due to opposing induced currents"
          ],
          visual: (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-center mb-3">Opposing the Change</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded">
                    <span className="text-sm">Magnet moves toward coil (N pole) →</span>
                    <span className="text-blue-400 font-bold">Induced N pole faces it ⛔</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-900/20 rounded">
                    <span className="text-sm">Magnet moves away from coil →</span>
                    <span className="text-red-400 font-bold">Induced S pole tries to pull back 🧲</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-center text-gray-400 italic">
                  "Nature resists change"
                </p>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "Direction", meaning: "Always opposes the change causing it" }
          ],
          sampleProblem: {
            question: "A magnet is pushed into a coil with North pole facing the coil. What is the direction of induced current?",
            given: [
              "Magnet N pole moving toward coil",
              "Need to find current direction"
            ],
            unknown: [
              "Direction of induced current = ?"
            ],
            solution: [
              "Step 1: Apply Lenz's Law",
              "Induced current opposes the change",
              "",
              "Step 2: Analyze the situation",
              "N pole moving toward coil → increasing flux",
              "To oppose this, coil must create N pole to repel",
              "",
              "Step 3: Determine current direction",
              "Right-hand rule: For N pole facing magnet,",
              "Current flows counter-clockwise (viewed from magnet side)"
            ],
            conclusion: "The induced current flows counter-clockwise, creating a N pole that repels the approaching magnet, opposing its motion."
          },
          keyPoints: [
            "Consequence of energy conservation",
            "Induced effect always opposes the cause",
            "Explains the negative sign in Faraday's law"
          ]
        },
        {
          id: "amperes-law",
          title: "Ampere's Law",
          formula: "∮B·dl = μ₀I",
          definition: "The line integral of magnetic field around any closed loop equals μ₀ times the current enclosed by that loop. Used to calculate magnetic fields in symmetric situations like solenoids and toroids.",
          realLife: [
            "Electromagnets - current through wire creates predictable magnetic field",
            "MRI machines - precisely calculated magnetic fields using Ampere's law",
            "Electric motors - magnetic field from current interacts with permanent magnets"
          ],
          visual: (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-center mb-3">Magnetic Field Around Current</p>
                <div className="text-center">
                  <p className="text-sm mb-2 text-gray-300">Current-carrying wire (right-hand rule):</p>
                  <div className="inline-block p-3 bg-yellow-900/20 rounded">
                    <p className="text-yellow-400 font-bold">👍 Thumb = Current direction</p>
                    <p className="text-blue-400">🤚 Fingers = B field circles</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-purple-900/30 rounded text-center">
                    <p className="text-purple-400 font-bold">Straight wire</p>
                    <p className="text-gray-300">B = μ₀I/(2πr)</p>
                  </div>
                  <div className="p-2 bg-pink-900/30 rounded text-center">
                    <p className="text-pink-400 font-bold">Solenoid</p>
                    <p className="text-gray-300">B = μ₀nI</p>
                  </div>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "∮B·dl", meaning: "Line integral of magnetic field around closed path" },
            { symbol: "μ₀", meaning: "Permeability of free space (4π×10⁻⁷ T·m/A)" },
            { symbol: "I", meaning: "Current enclosed by the path (Amperes)" }
          ],
          sampleProblem: {
            question: "Calculate the magnetic field 0.1m from a long straight wire carrying 5A of current.",
            given: [
              "I = 5 A",
              "r = 0.1 m",
              "μ₀ = 4π×10⁻⁷ T·m/A"
            ],
            unknown: [
              "B = ? (magnetic field)"
            ],
            solution: [
              "Step 1: Use Ampere's Law result for straight wire",
              "B = μ₀I/(2πr)",
              "",
              "Step 2: Substitute values",
              "B = (4π×10⁻⁷ × 5) / (2π × 0.1)",
              "B = (20π×10⁻⁷) / (0.2π)",
              "B = 100 × 10⁻⁷ = 1 × 10⁻⁵ T",
              "B = 10 μT"
            ],
            conclusion: "The magnetic field 0.1m from the wire is 10 microtesla, circulating around the wire according to the right-hand rule."
          },
          keyPoints: [
            "Right-hand rule determines field direction",
            "Field strength proportional to current",
            "Useful for calculating B in symmetric configurations"
          ]
        }
      ]
    }
  ]
},
optics: {
  title: "Optics Study Guide",
  icon: "🔭",
  color: "from-purple-500 to-pink-500",
  sections: [
    {
      title: "Key Definitions",
      content: [
        { term: "Light", def: "Electromagnetic radiation visible to the human eye. Travels at 3×10⁸ m/s in vacuum." },
        { term: "Reflection", def: "Bouncing back of light from a surface." },
        { term: "Refraction", def: "Bending of light when passing from one medium to another." },
        { term: "Focal Length", def: "Distance from lens/mirror to its focal point." },
        { term: "Refractive Index", def: "Ratio of speed of light in vacuum to speed in medium (n = c/v)." },
        { term: "Dispersion", def: "Separation of white light into its component colors." },
        { term: "Interference", def: "Superposition of two or more light waves." },
        { term: "Diffraction", def: "Bending of light around obstacles or through openings." },
        { term: "Polarization", def: "Restricting light vibrations to a single plane." },
        { term: "Critical Angle", def: "Angle of incidence beyond which total internal reflection occurs." }
      ]
    },
    {
      title: "Essential Formulas with Detailed Explanations",
      expandableLaws: [
        {
          id: "snells-law",
          title: "Snell's Law",
          formula: "n₁ sin θ₁ = n₂ sin θ₂",
          definition: "Describes how light bends when passing from one medium to another. The product of refractive index and sine of angle remains constant across the interface.",
          realLife: [
            "Pools appear shallower than they are due to light bending at water-air interface",
            "Mirage formation in deserts due to temperature gradient changing refractive index",
            "Lenses in glasses and cameras use refraction to focus light"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Refraction at Interface
              </h4>
              
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Interface line */}
                <line x1="50" y1="150" x2="350" y2="150" stroke="#3B82F6" strokeWidth="3"/>
                <text x="250" y="140" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">Interface</text>
                
                {/* Medium labels */}
                <text x="200" y="80" fill="#EF4444" fontSize="16" fontWeight="bold" textAnchor="middle">Medium 1 (n₁)</text>
                <text x="200" y="220" fill="#22C55E" fontSize="16" fontWeight="bold" textAnchor="middle">Medium 2 (n₂)</text>
                
                {/* Incident ray */}
                <line x1="100" y1="50" x2="200" y2="150" stroke="#EF4444" strokeWidth="3"/>
                <text x="120" y="40" fill="#EF4444" fontSize="14" fontWeight="bold">Incident</text>
                
                {/* Refracted ray */}
                <line x1="200" y1="150" x2="280" y2="220" stroke="#22C55E" strokeWidth="3"/>
                <text x="260" y="240" fill="#22C55E" fontSize="14" fontWeight="bold">Refracted</text>
                
                {/* Normal line */}
                <line x1="200" y1="50" x2="200" y2="250" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="5,5"/>
                <text x="190" y="30" fill="#9CA3AF" fontSize="12">Normal</text>
                
                {/* Angles */}
                <path d="M 200 120 Q 180 130, 170 110" fill="none" stroke="#F59E0B" strokeWidth="2"/>
                <text x="160" y="120" fill="#F59E0B" fontSize="14" fontWeight="bold">θ₁</text>
                
                <path d="M 200 180 Q 220 190, 230 170" fill="none" stroke="#F59E0B" strokeWidth="2"/>
                <text x="230" y="190" fill="#F59E0B" fontSize="14" fontWeight="bold">θ₂</text>
                
                {/* n comparison */}
                <rect x="320" y="60" width="70" height="60" fill="none" stroke="#A855F7" strokeWidth="2" rx="5"/>
                <text x="355" y="80" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">n₁ &gt; n₂</text>
                <text x="355" y="100" fill="#A855F7" fontSize="12" textAnchor="middle">θ₁ &lt; θ₂</text>
              </svg>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <p className="text-center font-bold text-blue-400 mb-2">n₁ &gt; n₂</p>
                  <p className="text-center text-sm text-blue-300">Light speeds up</p>
                  <p className="text-center text-xs text-gray-400 mt-1">Bends away from normal</p>
                </div>
                
                <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                  <p className="text-center font-bold text-green-400 mb-2">n₁ &lt; n₂</p>
                  <p className="text-center text-sm text-green-300">Light slows down</p>
                  <p className="text-center text-xs text-gray-400 mt-1">Bends toward normal</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "n₁, n₂", meaning: "Refractive indices of medium 1 and 2" },
            { symbol: "θ₁", meaning: "Angle of incidence (measured from normal)" },
            { symbol: "θ₂", meaning: "Angle of refraction (measured from normal)" }
          ],
          sampleProblem: {
            question: "Light travels from air (n=1.00) to water (n=1.33) at 30° incidence. Find the angle of refraction.",
            given: [
              "n₁ = 1.00 (air)",
              "n₂ = 1.33 (water)", 
              "θ₁ = 30°"
            ],
            unknown: [
              "θ₂ = ? (angle of refraction)"
            ],
            solution: [
              "Step 1: Apply Snell's Law",
              "n₁ sin θ₁ = n₂ sin θ₂",
              "",
              "Step 2: Substitute values",
              "1.00 × sin 30° = 1.33 × sin θ₂",
              "0.5 = 1.33 × sin θ₂",
              "",
              "Step 3: Solve for θ₂",
              "sin θ₂ = 0.5 / 1.33 ≈ 0.3759",
              "θ₂ = sin⁻¹(0.3759) ≈ 22.1°"
            ],
            conclusion: "The light bends toward the normal, refracting at approximately 22.1°. This bending occurs because light slows down in water."
          }
        },
        {
          id: "lens-formula",
          title: "Lens Formula",
          formula: "1/f = 1/v + 1/u",
          definition: "Relates the focal length of a lens to the object distance and image distance. Used to calculate image position and characteristics for both convex and concave lenses.",
          realLife: [
            "Camera focusing - adjusting lens position to get sharp images",
            "Eyeglasses prescription - determined by focal length needed for clear vision",
            "Microscopes and telescopes - using multiple lenses to magnify images"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Convex Lens Ray Diagram
              </h4>
              
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Lens */}
                <path d="M 180 80 Q 200 100, 180 120" fill="none" stroke="#3B82F6" strokeWidth="4"/>
                <path d="M 220 80 Q 200 100, 220 120" fill="none" stroke="#3B82F6" strokeWidth="4"/>
                <text x="200" y="140" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">Lens</text>
                
                {/* Principal axis */}
                <line x1="50" y1="100" x2="350" y2="100" stroke="#9CA3AF" strokeWidth="1"/>
                
                {/* Focal points */}
                <line x1="150" y1="95" x2="150" y2="105" stroke="#EF4444" strokeWidth="2"/>
                <line x1="250" y1="95" x2="250" y2="105" stroke="#EF4444" strokeWidth="2"/>
                <text x="150" y="115" fill="#EF4444" fontSize="12" fontWeight="bold" textAnchor="middle">F</text>
                <text x="250" y="115" fill="#EF4444" fontSize="12" fontWeight="bold" textAnchor="middle">F</text>
                
                {/* Object */}
                <line x1="100" y1="100" x2="100" y2="70" stroke="#22C55E" strokeWidth="3"/>
                <text x="90" y="65" fill="#22C55E" fontSize="14" fontWeight="bold" textAnchor="middle">Object</text>
                
                {/* Image */}
                <line x1="300" y1="100" x2="300" y2="130" stroke="#F59E0B" strokeWidth="3"/>
                <text x="290" y="145" fill="#F59E0B" fontSize="14" fontWeight="bold" textAnchor="middle">Image</text>
                
                {/* Ray 1: Parallel to axis */}
                <line x1="100" y1="70" x2="180" y2="70" stroke="#EF4444" strokeWidth="2"/>
                <line x1="180" y1="70" x2="250" y2="100" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5"/>
                
                {/* Ray 2: Through center */}
                <line x1="100" y1="70" x2="200" y2="100" stroke="#22C55E" strokeWidth="2"/>
                <line x1="200" y1="100" x2="300" y2="130" stroke="#22C55E" strokeWidth="2"/>
                
                {/* Ray 3: Through focus */}
                <line x1="100" y1="70" x2="150" y2="85" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5,5"/>
                <line x1="150" y1="85" x2="180" y2="80" stroke="#F59E0B" strokeWidth="2"/>
                <line x1="180" y1="80" x2="300" y2="130" stroke="#F59E0B" strokeWidth="2"/>
                
                {/* Distance labels */}
                <line x1="100" y1="40" x2="200" y2="40" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3"/>
                <text x="150" y="35" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">u</text>
                
                <line x1="200" y1="40" x2="300" y2="40" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3"/>
                <text x="250" y="35" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">v</text>
                
                <line x1="200" y1="20" x2="250" y2="20" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3"/>
                <text x="225" y="15" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">f</text>
              </svg>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <p className="text-purple-400 font-bold text-sm">Object Distance</p>
                  <p className="text-2xl font-mono text-purple-300">u</p>
                  <p className="text-xs text-gray-400">Always negative for real objects</p>
                </div>
                
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <p className="text-blue-400 font-bold text-sm">Image Distance</p>
                  <p className="text-2xl font-mono text-blue-300">v</p>
                  <p className="text-xs text-gray-400">+ for real, - for virtual images</p>
                </div>
                
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <p className="text-green-400 font-bold text-sm">Focal Length</p>
                  <p className="text-2xl font-mono text-green-300">f</p>
                  <p className="text-xs text-gray-400">+ for convex, - for concave</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "f", meaning: "Focal length (meters)" },
            { symbol: "u", meaning: "Object distance (meters)" },
            { symbol: "v", meaning: "Image distance (meters)" }
          ],
          sampleProblem: {
            question: "An object is placed 30 cm from a convex lens of focal length 10 cm. Find the image position and nature.",
            given: [
              "f = +10 cm (convex lens)",
              "u = -30 cm (object distance, negative by convention)"
            ],
            unknown: [
              "v = ? (image distance)",
              "Nature of image = ?"
            ],
            solution: [
              "Step 1: Apply lens formula",
              "1/f = 1/v + 1/u",
              "1/10 = 1/v + 1/(-30)",
              "",
              "Step 2: Solve for v",
              "1/10 = 1/v - 1/30",
              "1/v = 1/10 + 1/30 = 3/30 + 1/30 = 4/30",
              "v = 30/4 = 7.5 cm",
              "",
              "Step 3: Determine image nature",
              "Since v is positive, image is real",
              "Since |v| < |u|, image is diminished"
            ],
            conclusion: "The image is formed 7.5 cm from the lens, is real, inverted, and diminished. This is a typical case for objects beyond 2F in convex lenses."
          }
        },
        {
          id: "magnification",
          title: "Magnification Formula",
          formula: "m = h'/h = -v/u",
          definition: "Magnification is the ratio of image height to object height, or negative ratio of image distance to object distance. Positive magnification indicates upright image, negative indicates inverted image.",
          realLife: [
            "Magnifying glasses - produce upright, magnified virtual images",
            "Projectors - create large, inverted real images on screens",
            "Microscopes - combine multiple lenses for high magnification"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Magnification Examples
              </h4>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                  <p className="text-center font-bold text-green-400 mb-4">Magnified Image (m &gt; 1)</p>
                  <svg viewBox="0 0 200 150" className="w-full h-auto">
                    {/* Object */}
                    <line x1="50" y1="100" x2="50" y2="80" stroke="#22C55E" strokeWidth="3"/>
                    <text x="40" y="75" fill="#22C55E" fontSize="12" fontWeight="bold">h</text>
                    
                    {/* Image */}
                    <line x1="150" y1="100" x2="150" y2="60" stroke="#F59E0B" strokeWidth="4"/>
                    <text x="140" y="55" fill="#F59E0B" fontSize="12" fontWeight="bold">h'</text>
                    
                    {/* Lens */}
                    <line x1="100" y1="70" x2="100" y2="130" stroke="#3B82F6" strokeWidth="3"/>
                    <text x="100" y="140" fill="#3B82F6" fontSize="10" textAnchor="middle">Lens</text>
                    
                    {/* Arrow */}
                    <text x="100" y="115" fill="#A855F7" fontSize="16" fontWeight="bold" textAnchor="middle">→</text>
                    <text x="100" y="20" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">m = h'/h &gt; 1</text>
                  </svg>
                </div>
                
                <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                  <p className="text-center font-bold text-red-400 mb-4">Inverted Image (m &lt; 0)</p>
                  <svg viewBox="0 0 200 150" className="w-full h-auto">
                    {/* Object */}
                    <line x1="50" y1="100" x2="50" y2="80" stroke="#22C55E" strokeWidth="3"/>
                    <text x="40" y="75" fill="#22C55E" fontSize="12" fontWeight="bold">h</text>
                    
                    {/* Image */}
                    <line x1="150" y1="100" x2="150" y2="120" stroke="#F59E0B" strokeWidth="4"/>
                    <text x="140" y="130" fill="#F59E0B" fontSize="12" fontWeight="bold">h'</text>
                    
                    {/* Lens */}
                    <line x1="100" y1="70" x2="100" y2="130" stroke="#3B82F6" strokeWidth="3"/>
                    <text x="100" y="140" fill="#3B82F6" fontSize="10" textAnchor="middle">Lens</text>
                    
                    {/* Arrow */}
                    <text x="100" y="115" fill="#A855F7" fontSize="16" fontWeight="bold" textAnchor="middle">→</text>
                    <text x="100" y="20" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">m = -h'/h &lt; 0</text>
                  </svg>
                </div>
              </div>
              
              <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/30 text-center">
                <p className="text-purple-400 font-bold mb-2">Magnification Interpretation:</p>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-purple-800/30 rounded">
                    <p className="text-purple-300 font-bold">m &gt; 1</p>
                    <p className="text-gray-400">Enlarged</p>
                  </div>
                  <div className="p-2 bg-purple-800/30 rounded">
                    <p className="text-purple-300 font-bold">m = 1</p>
                    <p className="text-gray-400">Same size</p>
                  </div>
                  <div className="p-2 bg-purple-800/30 rounded">
                    <p className="text-purple-300 font-bold">0 &lt; m &lt; 1</p>
                    <p className="text-gray-400">Diminished</p>
                  </div>
                  <div className="p-2 bg-purple-800/30 rounded">
                    <p className="text-purple-300 font-bold">m &lt; 0</p>
                    <p className="text-gray-400">Inverted</p>
                  </div>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "m", meaning: "Magnification (dimensionless)" },
            { symbol: "h'", meaning: "Image height (meters)" },
            { symbol: "h", meaning: "Object height (meters)" },
            { symbol: "v", meaning: "Image distance (meters)" },
            { symbol: "u", meaning: "Object distance (meters)" }
          ],
          sampleProblem: {
            question: "An object 2 cm tall is placed 15 cm from a convex lens. The image is formed 30 cm from the lens. Calculate the magnification and image height.",
            given: [
              "h = 2 cm (object height)",
              "u = -15 cm (object distance)",
              "v = +30 cm (image distance)"
            ],
            unknown: [
              "m = ? (magnification)",
              "h' = ? (image height)"
            ],
            solution: [
              "Step 1: Calculate magnification",
              "m = -v/u = -30/(-15) = 2",
              "",
              "Step 2: Calculate image height", 
              "m = h'/h",
              "2 = h'/2",
              "h' = 4 cm",
              "",
              "Step 3: Interpret results",
              "Since m > 0, image is upright",
              "Since |m| > 1, image is enlarged"
            ],
            conclusion: "The magnification is 2, meaning the image is twice the size of the object and upright. The image height is 4 cm."
          }
        },
        {
          id: "critical-angle",
          title: "Critical Angle & Total Internal Reflection",
          formula: "sin θc = n₂/n₁ (n₁ > n₂)",
          definition: "When light travels from a denser to a rarer medium, the critical angle is the angle of incidence for which the angle of refraction is 90°. For angles greater than critical angle, total internal reflection occurs.",
          realLife: [
            "Optical fibers - use total internal reflection to transmit light over long distances",
            "Diamonds - cut to maximize total internal reflection for brilliance",
            "Prism binoculars - use prisms to reflect light through 90° angles"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Total Internal Reflection
              </h4>
              
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Interface */}
                <line x1="50" y1="150" x2="350" y2="150" stroke="#3B82F6" strokeWidth="3"/>
                <text x="140" y="140" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">Interface</text>
                
                {/* Medium labels */}
                <text x="200" y="80" fill="#EF4444" fontSize="16" fontWeight="bold" textAnchor="middle">Denser Medium (n₁)</text>
                <text x="200" y="220" fill="#22C55E" fontSize="16" fontWeight="bold" textAnchor="middle">Rarer Medium (n₂)</text>
                
                {/* Normal */}
                <line x1="200" y1="50" x2="200" y2="250" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="5,5"/>
                
                {/* Ray 1: Less than critical angle */}
                <line x1="200" y1="150" x2="150" y2="100" stroke="#22C55E" strokeWidth="2"/>
                <line x1="200" y1="150" x2="240" y2="130" stroke="#22C55E" strokeWidth="2"/>
                <text x="130" y="95" fill="#22C55E" fontSize="12">θ &lt; θc</text>
                <text x="230" y="125" fill="#22C55E" fontSize="12">Refraction</text>
                
                {/* Ray 2: At critical angle */}
                <line x1="200" y1="150" x2="170" y2="120" stroke="#F59E0B" strokeWidth="3"/>
                <line x1="200" y1="150" x2="280" y2="150" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5,5"/>
                <text x="110" y="110" fill="#F59E0B" fontSize="12" fontWeight="bold">θ = θc</text>
                <text x="280" y="135" fill="#F59E0B" fontSize="12">90° refraction</text>
                
                {/* Ray 3: Greater than critical angle */}
                <line x1="200" y1="150" x2="180" y2="130" stroke="#EF4444" strokeWidth="3"/>
                <line x1="200" y1="150" x2="180" y2="170" stroke="#EF4444" strokeWidth="3"/>
                <text x="170" y="115" fill="#EF4444" fontSize="12" fontWeight="bold">θ &gt; θc</text>
                <text x="190" y="185" fill="#EF4444" fontSize="12" fontWeight="bold">TIR</text>
                
                {/* Critical angle arc */}
                <path d="M 200 140 Q 190 145, 185 135" fill="none" stroke="#A855F7" strokeWidth="2"/>
                <text x="195" y="130" fill="#A855F7" fontSize="14" fontWeight="bold">θc</text>
                
                {/* 90° angle indicator */}
                <path d="M 270 150 Q 275 145, 280 150" fill="none" stroke="#F59E0B" strokeWidth="1"/>
                <text x="275" y="145" fill="#F59E0B" fontSize="10">90°</text>
              </svg>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <p className="text-green-400 font-bold text-sm">θ &lt; θc</p>
                  <p className="text-lg text-green-300">Refraction</p>
                  <p className="text-xs text-gray-400">Light enters second medium</p>
                </div>
                
                <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-400 font-bold text-sm">θ = θc</p>
                  <p className="text-lg text-yellow-300">Critical</p>
                  <p className="text-xs text-gray-400">Grazing emergence</p>
                </div>
                
                <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                  <p className="text-red-400 font-bold text-sm">θ &gt; θc</p>
                  <p className="text-lg text-red-300">TIR</p>
                  <p className="text-xs text-gray-400">Total internal reflection</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "θc", meaning: "Critical angle (degrees)" },
            { symbol: "n₁", meaning: "Refractive index of denser medium" },
            { symbol: "n₂", meaning: "Refractive index of rarer medium" }
          ],
          sampleProblem: {
            question: "Calculate the critical angle for light traveling from glass (n=1.5) to air (n=1.0).",
            given: [
              "n₁ = 1.5 (glass)",
              "n₂ = 1.0 (air)"
            ],
            unknown: [
              "θc = ? (critical angle)"
            ],
            solution: [
              "Step 1: Apply critical angle formula",
              "sin θc = n₂/n₁",
              "",
              "Step 2: Substitute values",
              "sin θc = 1.0 / 1.5 = 0.6667",
              "",
              "Step 3: Calculate angle",
              "θc = sin⁻¹(0.6667) ≈ 41.8°"
            ],
            conclusion: "The critical angle for glass-to-air interface is approximately 41.8°. For angles of incidence greater than this, total internal reflection occurs, which is utilized in optical fibers and prisms."
          }
        },
        {
          id: "youngs-double-slit",
          title: "Young's Double Slit Interference",
          formula: "β = λD/d",
          definition: "Describes the fringe width in Young's double-slit experiment. Bright fringes occur where path difference is whole number of wavelengths, dark fringes where path difference is half-integer wavelengths.",
          realLife: [
            "Measuring wavelength of light using interference patterns",
            "CD/DVD tracks act as diffraction gratings creating rainbow patterns",
            "Holography uses interference to record 3D information"
          ],
          visual: (
            <div className="space-y-6">
              <h4 className="text-center font-bold text-lg mb-6">
                Interference Pattern
              </h4>
              
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Double slit */}
                <rect x="180" y="50" width="40" height="100" fill="#1F2937" stroke="#4B5563" strokeWidth="2"/>
                <line x1="190" y1="50" x2="190" y2="150" stroke="#3B82F6" strokeWidth="3"/>
                <line x1="210" y1="50" x2="210" y2="150" stroke="#3B82F6" strokeWidth="3"/>
                <text x="200" y="170" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">Double Slit</text>
                <text x="185" y="40" fill="#9CA3AF" fontSize="10" textAnchor="middle">d</text>
                
                {/* Screen */}
                <rect x="350" y="30" width="5" height="200" fill="#6B7280" stroke="#4B5563" strokeWidth="2"/>
                <text x="355" y="250" fill="#6B7280" fontSize="14" fontWeight="bold">Screen</text>
                
                {/* Distance D */}
                <line x1="210" y1="180" x2="350" y2="180" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3"/>
                <text x="280" y="175" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">D</text>
                
                {/* Wave fronts */}
                {[60, 80, 100, 120, 140].map((y, i) => (
                  <path key={i} d={`M 210 ${y} Q 250 ${y-10}, 290 ${y} Q 330 ${y+10}, 350 ${y}`} 
                        fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
                ))}
                
                {[60, 80, 100, 120, 140].map((y, i) => (
                  <path key={i} d={`M 190 ${y} Q 150 ${y-10}, 110 ${y} Q 70 ${y+10}, 50 ${y}`} 
                        fill="none" stroke="#22C55E" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
                ))}
                
                {/* Interference pattern on screen */}
                <line x1="355" y1="80" x2="370" y2="80" stroke="#F59E0B" strokeWidth="4"/>
                <line x1="355" y1="100" x2="370" y2="100" stroke="#F59E0B" strokeWidth="6"/>
                <line x1="355" y1="120" x2="370" y2="120" stroke="#F59E0B" strokeWidth="8"/>
                <line x1="355" y1="140" x2="370" y2="140" stroke="#F59E0B" strokeWidth="6"/>
                <line x1="355" y1="160" x2="370" y2="160" stroke="#F59E0B" strokeWidth="4"/>
                
                <text x="370" y="100" fill="#F59E0B" fontSize="10">Bright</text>
                <text x="370" y="120" fill="#F59E0B" fontSize="7">Brightest</text>
                <text x="370" y="140" fill="#F59E0B" fontSize="10">Bright</text>
                
                {/* Fringe width */}
                <line x1="355" y1="95" x2="355" y2="125" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3"/>
                <text x="345" y="110" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">β</text>
              </svg>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <p className="text-center font-bold text-blue-400 mb-2">Constructive Interference</p>
                  <p className="text-center text-sm text-blue-300">Path difference = nλ</p>
                  <p className="text-center text-xs text-gray-400 mt-1">Bright fringes</p>
                </div>
                
                <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                  <p className="text-center font-bold text-red-400 mb-2">Destructive Interference</p>
                  <p className="text-center text-sm text-red-300">Path difference = (n+½)λ</p>
                  <p className="text-center text-xs text-gray-400 mt-1">Dark fringes</p>
                </div>
              </div>
            </div>
          ),
          symbols: [
            { symbol: "β", meaning: "Fringe width (distance between consecutive bright fringes)" },
            { symbol: "λ", meaning: "Wavelength of light" },
            { symbol: "D", meaning: "Distance from slits to screen" },
            { symbol: "d", meaning: "Distance between the two slits" }
          ],
          sampleProblem: {
            question: "In a double-slit experiment, slits are 0.2 mm apart and screen is 1 m away. If fringe width is 2.5 mm, find the wavelength of light used.",
            given: [
              "d = 0.2 mm = 0.2 × 10⁻³ m",
              "D = 1 m",
              "β = 2.5 mm = 2.5 × 10⁻³ m"
            ],
            unknown: [
              "λ = ? (wavelength)"
            ],
            solution: [
              "Step 1: Apply fringe width formula",
              "β = λD/d",
              "",
              "Step 2: Rearrange for λ",
              "λ = βd/D",
              "",
              "Step 3: Substitute values",
              "λ = (2.5 × 10⁻³) × (0.2 × 10⁻³) / 1",
              "λ = 5.0 × 10⁻⁷ m",
              "λ = 500 × 10⁻⁹ m = 500 nm"
            ],
            conclusion: "The wavelength of light used is 500 nm, which corresponds to green light. This demonstrates how interference patterns can be used to measure wavelengths."
          }
        }
      ]
    },
    {
      title: "Visual Concepts",
      diagrams: [
        { 
          name: "Convex Lens Ray Diagram",
          svg: (
            <svg viewBox="0 0 400 250" className="w-full h-auto">
              {/* Lens */}
              <path d="M 160 80 Q 200 100, 160 120" fill="none" stroke="#3B82F6" strokeWidth="4"/>
              <path d="M 240 80 Q 200 100, 240 120" fill="none" stroke="#3B82F6" strokeWidth="4"/>
              <text x="200" y="140" fill="#3B82F6" fontSize="14" fontWeight="bold" textAnchor="middle">Convex Lens</text>
              
              {/* Principal axis */}
              <line x1="50" y1="100" x2="350" y2="100" stroke="#9CA3AF" strokeWidth="1"/>
              
              {/* Focal points */}
              <line x1="120" y1="95" x2="120" y2="105" stroke="#EF4444" strokeWidth="2"/>
              <line x1="280" y1="95" x2="280" y2="105" stroke="#EF4444" strokeWidth="2"/>
              <text x="120" y="115" fill="#EF4444" fontSize="12" fontWeight="bold" textAnchor="middle">F</text>
              <text x="280" y="115" fill="#EF4444" fontSize="12" fontWeight="bold" textAnchor="middle">F</text>
              
              {/* Object beyond 2F */}
              <line x1="80" y1="100" x2="80" y2="70" stroke="#22C55E" strokeWidth="3"/>
              <text x="70" y="65" fill="#22C55E" fontSize="14" fontWeight="bold" textAnchor="middle">Object</text>
              
              {/* Image between F and 2F */}
              <line x1="320" y1="100" x2="320" y2="130" stroke="#F59E0B" strokeWidth="3"/>
              <text x="310" y="145" fill="#F59E0B" fontSize="14" fontWeight="bold" textAnchor="middle">Image</text>
              
              {/* Three principal rays */}
              <line x1="80" y1="70" x2="160" y2="70" stroke="#EF4444" strokeWidth="2"/>
              <line x1="160" y1="70" x2="280" y2="100" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5"/>
              
              <line x1="80" y1="70" x2="200" y2="100" stroke="#22C55E" strokeWidth="2"/>
              <line x1="200" y1="100" x2="320" y2="130" stroke="#22C55E" strokeWidth="2"/>
              
              <line x1="80" y1="70" x2="120" y2="85" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="120" y1="85" x2="160" y2="80" stroke="#F59E0B" strokeWidth="2"/>
              <line x1="160" y1="80" x2="320" y2="130" stroke="#F59E0B" strokeWidth="2"/>
              
              <text x="200" y="180" fill="#9CA3AF" fontSize="14" textAnchor="middle" fontWeight="bold">Real, Inverted, Diminished Image</text>
            </svg>
          ),
          description: "Object beyond 2F: Image is real, inverted, diminished, between F and 2F"
        },
        { 
          name: "Concave Mirror Ray Diagram",
          svg: (
            <svg viewBox="0 0 400 250" className="w-full h-auto">
              {/* Mirror */}
              <path d="M 100 80 Q 200 100, 100 120" fill="none" stroke="#8B5CF6" strokeWidth="4"/>
              <text x="140" y="140" fill="#8B5CF6" fontSize="12" fontWeight="bold" textAnchor="middle">Concave Mirror</text>
              
              {/* Principal axis */}
              <line x1="50" y1="100" x2="350" y2="100" stroke="#9CA3AF" strokeWidth="1"/>
              
              {/* Center of curvature and focus */}
              <line x1="250" y1="95" x2="250" y2="105" stroke="#EF4444" strokeWidth="2"/>
              <line x1="200" y1="95" x2="200" y2="105" stroke="#F59E0B" strokeWidth="2"/>
              <text x="250" y="115" fill="#EF4444" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
              <text x="200" y="115" fill="#F59E0B" fontSize="12" fontWeight="bold" textAnchor="middle">F</text>
              
              {/* Object between C and F */}
              <line x1="280" y1="100" x2="280" y2="70" stroke="#22C55E" strokeWidth="3"/>
              <text x="270" y="65" fill="#22C55E" fontSize="12" fontWeight="bold" textAnchor="middle">Object</text>
              
              {/* Image beyond C */}
              <line x1="220" y1="100" x2="220" y2="130" stroke="#F59E0B" strokeWidth="3"/>
              <text x="210" y="145" fill="#F59E0B" fontSize="12" fontWeight="bold" textAnchor="middle">Image</text>
              
              {/* Rays */}
              <line x1="280" y1="70" x2="100" y2="95" stroke="#EF4444" strokeWidth="2"/>
              <line x1="100" y1="95" x2="220" y2="130" stroke="#EF4444" strokeWidth="2"/>
              
              <line x1="280" y1="70" x2="200" y2="100" stroke="#22C55E" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="200" y1="100" x2="220" y2="130" stroke="#22C55E" strokeWidth="2"/>
              
              <line x1="280" y1="70" x2="250" y2="100" stroke="#F59E0B" strokeWidth="2"/>
              <line x1="250" y1="100" x2="220" y2="130" stroke="#F59E0B" strokeWidth="2"/>
              
              <text x="200" y="180" fill="#9CA3AF" fontSize="14" textAnchor="middle" fontWeight="bold">Real, Inverted, Magnified Image</text>
            </svg>
          ),
          description: "Object between C and F: Image is real, inverted, magnified, beyond C"
        },
        { 
          name: "Total Internal Reflection",
          svg: (
            <svg viewBox="0 0 400 250" className="w-full h-auto">
              {/* Background */}
              <rect x="0" y="0" width="400" height="250" fill="#0f172a" />
              
              {/* Water area with gradient */}
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="airGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#374151" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Air and Water sections */}
              <rect x="0" y="0" width="400" height="125" fill="url(#airGradient)"/>
              <rect x="0" y="125" width="400" height="125" fill="url(#waterGradient)"/>
              
              {/* Interface line */}
              <line x1="0" y1="125" x2="400" y2="125" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8,4"/>
              
              {/* Normal line */}
              <line x1="200" y1="50" x2="200" y2="200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4"/>
              
              {/* Incident ray */}
              <line x1="200" y1="125" x2="170" y2="95" stroke="#22c55e" strokeWidth="3"/>
              <text x="120" y="110" fill="#22c55e" fontSize="12" fontWeight="bold">Incident</text>
              
              {/* Reflected ray */}
              <line x1="200" y1="125" x2="170" y2="155" stroke="#ef4444" strokeWidth="3"/>
              <text x="120" y="170" fill="#ef4444" fontSize="12" fontWeight="bold">Reflected</text>
              
              {/* Critical angle indicator */}
              <path d="M 200 115 Q 185 120, 180 110" fill="none" stroke="#f59e0b" strokeWidth="2"/>
              <text x="210" y="115" fill="#f59e0b" fontSize="12" fontWeight="bold">θ &gt; θc</text>
              
              {/* Labels */}
              <text x="50" y="60" fill="#60a5fa" fontSize="14" fontWeight="bold">Water (n=1.33)</text>
              <text x="50" y="80" fill="#60a5fa" fontSize="12">Denser Medium</text>
              
              <text x="50" y="180" fill="#94a3b8" fontSize="14" fontWeight="bold">Air (n=1.00)</text>
              <text x="50" y="200" fill="#94a3b8" fontSize="12">Rarer Medium</text>
              
              {/* TIR Explanation */}
              <rect x="250" y="60" width="130" height="80" fill="#1e293b" stroke="#ef4444" strokeWidth="2" rx="8"/>
              <text x="315" y="80" fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="middle">TIR Condition</text>
              <text x="315" y="100" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">θ &gt; θc = 48.8°</text>
              <text x="315" y="115" fill="#cbd5e1" fontSize="10" textAnchor="middle">No light escapes</text>
              <text x="315" y="130" fill="#cbd5e1" fontSize="10" textAnchor="middle">100% reflection</text>
              
              {/* Title */}
              <text x="200" y="230" fill="#cbd5e1" fontSize="13" textAnchor="middle" fontWeight="bold">
                Total Internal Reflection: Light trapped inside denser medium
              </text>
            </svg>
          ),
          description: "When incident angle exceeds critical angle, all light reflects back into denser medium"
        },
        { 
          name: "Dispersion through Prism",
          svg: (
            <svg viewBox="0 0 400 250" className="w-full h-auto">
              {/* Background */}
              <rect x="0" y="0" width="400" height="250" fill="#0f172a" />
              
              {/* Prism with gradient */}
              <defs>
                <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <polygon points="150,80 250,80 200,180" fill="url(#prismGradient)" stroke="#8B5CF6" strokeWidth="2"/>
              
              {/* White light incident */}
              <line x1="50" y1="100" x2="145" y2="100" stroke="#FFFFFF" strokeWidth="4"/>
              <text x="80" y="85" fill="#FFFFFF" fontSize="12" fontWeight="bold">White Light</text>
              
              {/* Spectrum rays with proper angles */}
              <line x1="200" y1="180" x2="320" y2="140" stroke="#EF4444" strokeWidth="3"/>
              <line x1="200" y1="180" x2="320" y2="150" stroke="#F59E0B" strokeWidth="3"/>
              <line x1="200" y1="180" x2="320" y2="160" stroke="#22C55E" strokeWidth="3"/>
              <line x1="200" y1="180" x2="320" y2="170" stroke="#3B82F6" strokeWidth="3"/>
              <line x1="200" y1="180" x2="320" y2="180" stroke="#8B5CF6" strokeWidth="3"/>
              
              {/* Clean color labels */}
              <g fill="white" fontSize="11" fontWeight="bold">
                <text x="340" y="140" fill="#EF4444">Red</text>
                <text x="340" y="150" fill="#F59E0B">Orange</text>
                <text x="340" y="160" fill="#22C55E">Green</text>
                <text x="340" y="170" fill="#3B82F6">Blue</text>
                <text x="340" y="180" fill="#8B5CF6">Violet</text>
              </g>
              
              {/* Wavelength indicators */}
              <text x="340" y="125" fill="#94a3b8" fontSize="10" fontWeight="bold">Long λ</text>
              <text x="340" y="195" fill="#94a3b8" fontSize="10" fontWeight="bold">Short λ</text>
              <line x1="335" y1="130" x2="335" y2="185" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3"/>
              
              {/* Title */}
              <text x="200" y="220" fill="#cbd5e1" fontSize="13" textAnchor="middle" fontWeight="bold">
                Dispersion: Violet bends most, Red bends least
              </text>
            </svg>
          ),
          description: "Prism separates white light into spectrum - different wavelengths refract at different angles"
        }
      ]
    },
  ]
},
  thermodynamics: {
    title: "Thermodynamics Study Guide",
    icon: "🔥",
    color: "from-red-500 to-orange-500",
    sections: [
      {
        title: "Key Definitions",
        content: [
          { term: "Temperature", def: "Measure of average kinetic energy of particles. Measured in Kelvin (K)." },
          { term: "Heat", def: "Energy transferred due to temperature difference. Measured in Joules (J)." },
          { term: "Internal Energy", def: "Total energy of all particles in a system." },
          { term: "Entropy", def: "Measure of disorder or randomness in a system." },
          { term: "Specific Heat", def: "Heat required to raise temperature of 1kg substance by 1K." },
          { term: "Latent Heat", def: "Heat required to change state without temperature change." },
          { term: "Thermal Equilibrium", def: "State where no net heat flows between objects." },
          { term: "Adiabatic Process", def: "Process with no heat exchange (Q = 0)." },
          { term: "Isothermal Process", def: "Process at constant temperature (ΔT = 0)." },
          { term: "Isobaric Process", def: "Process at constant pressure." },
          { term: "Isochoric Process", def: "Process at constant volume." }
        ]
      },
      {
        title: "Essential Formulas with Detailed Explanations",
        expandableLaws: [
          {
            id: "first-law",
            title: "First Law of Thermodynamics",
            formula: "ΔU = Q - W",
            definition: "The change in internal energy of a system equals the heat added to the system minus the work done by the system. This is essentially the law of energy conservation for thermodynamic systems.",
            realLife: [
              "Car engines - convert heat from fuel combustion into mechanical work",
              "Refrigerators - use work to transfer heat from cold to hot space",
              "Human body - converts chemical energy (food) into heat and work"
            ],
            visual: (
              <div className="space-y-6">
                <h4 className="text-center font-bold text-lg mb-6">
                  Energy Flow in Thermodynamic System
                </h4>
                
                <svg viewBox="0 0 400 250" className="w-full h-auto">
                  {/* System boundary */}
                  <circle cx="200" cy="125" r="80" fill="none" stroke="#EF4444" strokeWidth="3"/>
                  <text x="200" y="30" fill="#EF4444" fontSize="16" fontWeight="bold" textAnchor="middle">System Boundary</text>
                  
                  {/* Heat in */}
                  <line x1="50" y1="125" x2="120" y2="125" stroke="#F59E0B" strokeWidth="4"/>
                  <polygon points="120,125 110,120 110,130" fill="#F59E0B"/>
                  <text x="40" y="115" fill="#F59E0B" fontSize="12" fontWeight="bold">Q (Heat IN)</text>
                  
                  {/* Work out */}
                  <line x1="280" y1="125" x2="350" y2="125" stroke="#3B82F6" strokeWidth="4"/>
                  <polygon points="280,125 290,120 290,130" fill="#3B82F6"/>
                  <text x="315" y="115" fill="#3B82F6" fontSize="12" fontWeight="bold">W (Work OUT)</text>
                  
                  {/* Internal energy */}
                  <text x="200" y="125" fill="#22C55E" fontSize="18" fontWeight="bold" textAnchor="middle">ΔU</text>
                  <text x="200" y="145" fill="#22C55E" fontSize="14" textAnchor="middle">Internal Energy</text>
                  
                  {/* Energy conservation equation */}
                  <rect x="150" y="170" width="100" height="40" fill="#1F2937" stroke="#A855F7" strokeWidth="2" rx="5"/>
                  <text x="200" y="185" fill="#A855F7" fontSize="16" fontWeight="bold" textAnchor="middle">ΔU = Q - W</text>
                  <text x="200" y="200" fill="#A855F7" fontSize="8" textAnchor="middle">Energy Conservation</text>
                </svg>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <p className="text-yellow-400 font-bold text-sm">Q &gt; 0</p>
                    <p className="text-lg text-yellow-300">Heat IN</p>
                    <p className="text-xs text-gray-400">System gains energy</p>
                  </div>
                  
                  <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <p className="text-blue-400 font-bold text-sm">W &gt; 0</p>
                    <p className="text-lg text-blue-300">Work OUT</p>
                    <p className="text-xs text-gray-400">System loses energy</p>
                  </div>
                  
                  <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                    <p className="text-green-400 font-bold text-sm">ΔU</p>
                    <p className="text-lg text-green-300">Net Change</p>
                    <p className="text-xs text-gray-400">Energy stored</p>
                  </div>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "ΔU", meaning: "Change in internal energy (Joules)" },
              { symbol: "Q", meaning: "Heat added to system (Joules)" },
              { symbol: "W", meaning: "Work done by system (Joules)" }
            ],
            sampleProblem: {
              question: "A gas absorbs 500 J of heat and does 200 J of work on its surroundings. What is the change in its internal energy?",
              given: [
                "Q = +500 J (heat absorbed)",
                "W = +200 J (work done by system)"
              ],
              unknown: [
                "ΔU = ? (change in internal energy)"
              ],
              solution: [
                "Step 1: Apply First Law of Thermodynamics",
                "ΔU = Q - W",
                "",
                "Step 2: Substitute values",
                "ΔU = 500 J - 200 J",
                "ΔU = 300 J"
              ],
              conclusion: "The internal energy increases by 300 Joules. The system gained more energy from heat than it lost through work."
            }
          },
          {
            id: "ideal-gas-law",
            title: "Ideal Gas Law",
            formula: "PV = nRT",
            definition: "Relates pressure, volume, temperature, and amount of an ideal gas. This fundamental equation describes the state of an ideal gas under various conditions.",
            realLife: [
              "Weather balloons - expand as they rise due to decreasing pressure",
              "Car tires - pressure changes with temperature variations",
              "Scuba diving - gas volume changes with depth pressure"
            ],
            visual: (
              <div className="space-y-6">
                <h4 className="text-center font-bold text-lg mb-6">
                  Ideal Gas Relationships
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Boyle's Law */}
                  <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                    <p className="text-center font-bold text-purple-400 mb-4">Boyle's Law (P vs V)</p>
                    <svg viewBox="0 0 200 150" className="w-full h-auto">
                      {/* Axes */}
                      <line x1="30" y1="20" x2="30" y2="130" stroke="#9CA3AF" strokeWidth="2"/>
                      <line x1="30" y1="130" x2="170" y2="130" stroke="#9CA3AF" strokeWidth="2"/>
                      <text x="15" y="75" fill="#9CA3AF" fontSize="12" transform="rotate(-90 15,75)">Pressure (P)</text>
                      <text x="100" y="145" fill="#9CA3AF" fontSize="12">Volume (V)</text>
                      
                      {/* Hyperbolic curve */}
                      <path d="M 40 30 Q 80 60, 120 80 Q 160 110, 160 120" 
                            fill="none" stroke="#A855F7" strokeWidth="3"/>
                      <text x="100" y="50" fill="#A855F7" fontSize="12" fontWeight="bold">P ∝ 1/V</text>
                      <text x="100" y="65" fill="#A855F7" fontSize="10">(T constant)</text>
                    </svg>
                  </div>
                  
                  {/* Charles's Law */}
                  <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                    <p className="text-center font-bold text-blue-400 mb-4">Charles's Law (V vs T)</p>
                    <svg viewBox="0 0 200 150" className="w-full h-auto">
                      {/* Axes */}
                      <line x1="30" y1="20" x2="30" y2="130" stroke="#9CA3AF" strokeWidth="2"/>
                      <line x1="30" y1="130" x2="170" y2="130" stroke="#9CA3AF" strokeWidth="2"/>
                      <text x="15" y="75" fill="#9CA3AF" fontSize="12" transform="rotate(-90 15,75)">Volume (V)</text>
                      <text x="100" y="145" fill="#9CA3AF" fontSize="12">Temperature (T)</text>
                      
                      {/* Linear curve */}
                      <line x1="40" y1="120" x2="160" y2="30" stroke="#3B82F6" strokeWidth="3"/>
                      <text x="100" y="50" fill="#3B82F6" fontSize="12" fontWeight="bold">V ∝ T</text>
                      <text x="100" y="65" fill="#3B82F6" fontSize="10">(P constant)</text>
                    </svg>
                  </div>
                </div>
                
                <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30 text-center">
                  <p className="text-red-400 font-bold mb-2">Ideal Gas Law Formula</p>
                  <div className="bg-black/30 rounded-lg p-3 inline-block">
                    <code className="text-xl font-mono text-white">
                      PV = nRT
                    </code>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                    <div className="p-2 bg-red-800/30 rounded">
                      <p className="text-red-300 font-bold">P</p>
                      <p className="text-gray-400">Pressure</p>
                    </div>
                    <div className="p-2 bg-red-800/30 rounded">
                      <p className="text-red-300 font-bold">V</p>
                      <p className="text-gray-400">Volume</p>
                    </div>
                    <div className="p-2 bg-red-800/30 rounded">
                      <p className="text-red-300 font-bold">n</p>
                      <p className="text-gray-400">Moles</p>
                    </div>
                    <div className="p-2 bg-red-800/30 rounded">
                      <p className="text-red-300 font-bold">T</p>
                      <p className="text-gray-400">Temperature</p>
                    </div>
                  </div>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "P", meaning: "Pressure (Pascals)" },
              { symbol: "V", meaning: "Volume (m³)" },
              { symbol: "n", meaning: "Number of moles" },
              { symbol: "R", meaning: "Universal gas constant (8.314 J/mol·K)" },
              { symbol: "T", meaning: "Temperature (Kelvin)" }
            ],
            sampleProblem: {
              question: "Calculate the volume of 2 moles of an ideal gas at 300 K and 100 kPa pressure.",
              given: [
                "n = 2 moles",
                "T = 300 K",
                "P = 100 kPa = 100,000 Pa",
                "R = 8.314 J/mol·K"
              ],
              unknown: [
                "V = ? (volume)"
              ],
              solution: [
                "Step 1: Apply Ideal Gas Law",
                "PV = nRT",
                "",
                "Step 2: Rearrange for V",
                "V = nRT/P",
                "",
                "Step 3: Substitute values",
                "V = (2 × 8.314 × 300) / 100,000",
                "V = 4988.4 / 100,000",
                "V = 0.04988 m³ = 49.88 L"
              ],
              conclusion: "The volume of the gas is approximately 49.88 liters at the given conditions."
            }
          },
          {
            id: "heat-capacity",
            title: "Heat Capacity Equations",
            formula: "Q = mcΔT  and  Q = mL",
            definition: "The heat required to change temperature depends on mass, specific heat, and temperature change. For phase changes, heat depends on mass and latent heat without temperature change.",
            realLife: [
              "Cooking - different foods require different amounts of heat",
              "Climate systems - oceans absorb large amounts of heat",
              "Ice melting - requires heat without temperature change"
            ],
            visual: (
              <div className="space-y-6">
                <h4 className="text-center font-bold text-lg mb-6">
                  Heat Transfer Processes
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Temperature change */}
                  <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                    <p className="text-center font-bold text-green-400 mb-4">Temperature Change</p>
                    <svg viewBox="0 0 200 150" className="w-full h-auto">
                      {/* Thermometer */}
                      <rect x="80" y="30" width="40" height="100" fill="#1F2937" stroke="#4B5563" strokeWidth="2"/>
                      <rect x="85" y="35" width="30" height="90" fill="#1F2937" stroke="#4B5563" strokeWidth="1"/>
                      
                      {/* Mercury rising */}
                      <rect x="90" y="80" width="20" height="40" fill="#EF4444"/>
                      
                      {/* Labels */}
                      <text x="100" y="25" fill="#22C55E" fontSize="12" fontWeight="bold" textAnchor="middle">Q = mcΔT</text>
                      <text x="30" y="70" fill="#22C55E" fontSize="10">T₁ = 20°C</text>
                      <text x="30" y="110" fill="#EF4444" fontSize="10">T₂ = 60°C</text>
                      <text x="100" y="140" fill="#9CA3AF" fontSize="10">Temperature increases</text>
                    </svg>
                  </div>
                  
                  {/* Phase change */}
                  <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                    <p className="text-center font-bold text-blue-400 mb-4">Phase Change</p>
                    <svg viewBox="0 0 200 150" className="w-full h-auto">
                      {/* Ice cube melting */}
                      <rect x="70" y="50" width="60" height="40" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2"/>
                      <text x="100" y="70" fill="#1E40AF" fontSize="10" fontWeight="bold" textAnchor="middle">ICE</text>
                      
                      {/* Water forming */}
                      <path d="M 60 100 Q 100 110, 140 100 Q 100 120, 60 100" 
                            fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1"/>
                      
                      {/* Heat arrows */}
                      <line x1="100" y1="30" x2="100" y2="45" stroke="#F59E0B" strokeWidth="2"/>
                      <polygon points="100,30 95,35 105,35" fill="#F59E0B"/>
                      
                      {/* Labels */}
                      <text x="100" y="25" fill="#3B82F6" fontSize="12" fontWeight="bold" textAnchor="middle">Q = mL</text>
                      <text x="100" y="140" fill="#9CA3AF" fontSize="10">Phase changes at constant T</text>
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30 text-center">
                    <p className="text-green-400 font-bold text-sm">Sensible Heat</p>
                    <p className="text-green-300 text-lg">Q = mcΔT</p>
                    <p className="text-gray-400 text-xs">Temperature changes</p>
                  </div>
                  
                  <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30 text-center">
                    <p className="text-blue-400 font-bold text-sm">Latent Heat</p>
                    <p className="text-blue-300 text-lg">Q = mL</p>
                    <p className="text-gray-400 text-xs">Phase changes</p>
                  </div>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "Q", meaning: "Heat transferred (Joules)" },
              { symbol: "m", meaning: "Mass (kilograms)" },
              { symbol: "c", meaning: "Specific heat capacity (J/kg·K)" },
              { symbol: "ΔT", meaning: "Temperature change (Kelvin)" },
              { symbol: "L", meaning: "Latent heat (J/kg)" }
            ],
            sampleProblem: {
              question: "How much heat is required to melt 0.5 kg of ice at 0°C? (Latent heat of fusion for ice = 334,000 J/kg)",
              given: [
                "m = 0.5 kg",
                "L = 334,000 J/kg",
                "Ice at melting point (0°C)"
              ],
              unknown: [
                "Q = ? (heat required)"
              ],
              solution: [
                "Step 1: Apply latent heat formula",
                "Q = mL",
                "",
                "Step 2: Substitute values",
                "Q = 0.5 kg × 334,000 J/kg",
                "Q = 167,000 J"
              ],
              conclusion: "167,000 Joules of heat are required to melt 0.5 kg of ice. This heat energy goes into breaking molecular bonds without changing temperature."
            }
          },
          {
            id: "carnot-efficiency",
            title: "Carnot Efficiency",
            formula: "η = 1 - T₂/T₁",
            definition: "The maximum possible efficiency of a heat engine operating between two temperature reservoirs. No real engine can be more efficient than a Carnot engine operating between the same temperatures.",
            realLife: [
              "Power plants - maximum theoretical efficiency limited by temperature difference",
              "Car engines - actual efficiency much lower than Carnot limit",
              "Refrigerators - work better with larger temperature differences"
            ],
            visual: (
              <div className="space-y-6">
                <h4 className="text-center font-bold text-lg mb-6">
                  Carnot Heat Engine
                </h4>
                
                <svg viewBox="0 0 400 250" className="w-full h-auto">
                  {/* Hot reservoir */}
                  <rect x="50" y="30" width="300" height="40" fill="#EF4444" opacity="0.3" stroke="#DC2626" strokeWidth="2"/>
                  <text x="200" y="55" fill="#DC2626" fontSize="16" fontWeight="bold" textAnchor="middle">Hot Reservoir (T₁)</text>
                  
                  {/* Cold reservoir */}
                  <rect x="50" y="180" width="300" height="40" fill="#3B82F6" opacity="0.3" stroke="#1D4ED8" strokeWidth="2"/>
                  <text x="200" y="205" fill="#1D4ED8" fontSize="16" fontWeight="bold" textAnchor="middle">Cold Reservoir (T₂)</text>
                  
                  {/* Heat engine */}
                  <circle cx="200" cy="125" r="30" fill="#1F2937" stroke="#F59E0B" strokeWidth="3"/>
                  <text x="200" y="125" fill="#F59E0B" fontSize="14" fontWeight="bold" textAnchor="middle">Engine</text>
                  
                  {/* Heat flow from hot */}
                  <line x1="200" y1="70" x2="200" y2="95" stroke="#EF4444" strokeWidth="4"/>
                  <polygon points="200,70 195,80 205,80" fill="#EF4444"/>
                  <text x="220" y="85" fill="#EF4444" fontSize="10" fontWeight="bold">Q₁ (Heat IN)</text>
                  
                  {/* Heat flow to cold */}
                  <line x1="200" y1="155" x2="200" y2="180" stroke="#3B82F6" strokeWidth="4"/>
                  <polygon points="200,180 195,170 205,170" fill="#3B82F6"/>
                  <text x="220" y="165" fill="#3B82F6" fontSize="10" fontWeight="bold">Q₂ (Waste Heat)</text>
                  
                  {/* Work output */}
                  <line x1="230" y1="125" x2="270" y2="125" stroke="#22C55E" strokeWidth="4"/>
                  <polygon points="270,125 260,120 260,130" fill="#22C55E"/>
                  <text x="250" y="115" fill="#22C55E" fontSize="10" fontWeight="bold">W (Work OUT)</text>
                  
                  {/* Efficiency box */}
                  <rect x="50" y="80" width="100" height="50" fill="#1F2937" stroke="#A855F7" strokeWidth="2" rx="5"/>
                  <text x="100" y="95" fill="#A855F7" fontSize="14" fontWeight="bold" textAnchor="middle">η = 1 - T₂/T₁</text>
                  <text x="100" y="110" fill="#A855F7" fontSize="12" textAnchor="middle">Max Efficiency</text>
                  <text x="100" y="125" fill="#A855F7" fontSize="10" textAnchor="middle">η &lt; 1 always</text>
                </svg>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <p className="text-red-400 font-bold text-sm">T₁ ↑</p>
                    <p className="text-lg text-red-300">Higher temp</p>
                    <p className="text-xs text-gray-400">Better efficiency</p>
                  </div>
                  
                  <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <p className="text-blue-400 font-bold text-sm">T₂ ↓</p>
                    <p className="text-lg text-blue-300">Lower temp</p>
                    <p className="text-xs text-gray-400">Better efficiency</p>
                  </div>
                  
                  <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                    <p className="text-purple-400 font-bold text-sm">ΔT ↑</p>
                    <p className="text-lg text-purple-300">Larger diff</p>
                    <p className="text-xs text-gray-400">Max efficiency</p>
                  </div>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "η", meaning: "Efficiency (0 to 1, or 0% to 100%)" },
              { symbol: "T₁", meaning: "Hot reservoir temperature (Kelvin)" },
              { symbol: "T₂", meaning: "Cold reservoir temperature (Kelvin)" }
            ],
            sampleProblem: {
              question: "A Carnot engine operates between 500 K and 300 K. Calculate its maximum possible efficiency.",
              given: [
                "T₁ = 500 K (hot reservoir)",
                "T₂ = 300 K (cold reservoir)"
              ],
              unknown: [
                "η = ? (efficiency)"
              ],
              solution: [
                "Step 1: Apply Carnot efficiency formula",
                "η = 1 - T₂/T₁",
                "",
                "Step 2: Substitute values",
                "η = 1 - 300/500",
                "η = 1 - 0.6",
                "η = 0.4"
              ],
              conclusion: "The maximum possible efficiency is 0.4 or 40%. No real engine operating between these temperatures can exceed this efficiency due to the Second Law of Thermodynamics."
            }
          }
        ]
      },
      {
        title: "Visual Concepts",
        diagrams: [
          { 
            name: "Heat Transfer Methods",
            svg: (
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width="400" height="250" fill="#0f172a" />
                
                {/* Conduction */}
                <rect x="50" y="40" width="80" height="40" fill="#ef4444" opacity="0.3" stroke="#dc2626" strokeWidth="2"/>
                <rect x="150" y="40" width="80" height="40" fill="#3b82f6" opacity="0.3" stroke="#1d4ed8" strokeWidth="2"/>
                <line x1="130" y1="60" x2="150" y2="60" stroke="#f59e0b" strokeWidth="3"/>
                <text x="60" y="30" fill="#ef4444" fontSize="12" fontWeight="bold">Hot Object</text>
                <text x="160" y="30" fill="#3b82f6" fontSize="12" fontWeight="bold">Cold Object</text>
                <text x="140" y="90" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">Conduction</text>
                <text x="140" y="100" fill="#9ca3af" fontSize="10" textAnchor="middle">Direct contact</text>
                
                {/* Convection */}
                <rect x="50" y="130" width="100" height="60" fill="#1e3a8a" opacity="0.3" stroke="#1d4ed8" strokeWidth="2"/>
                <path d="M 80 140 Q 100 120, 120 140 Q 140 160, 120 180" fill="none" stroke="#22c55e" strokeWidth="3"/>
                <text x="100" y="125" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">Convection</text>
                <text x="100" y="200" fill="#9ca3af" fontSize="10" textAnchor="middle">Fluid movement</text>
                
                {/* Radiation */}
                <circle cx="300" cy="100" r="30" fill="#f59e0b" opacity="0.3" stroke="#d97706" strokeWidth="2"/>
                <line x1="330" y1="100" x2="370" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3"/>
                <line x1="300" y1="130" x2="300" y2="170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3"/>
                <line x1="270" y1="100" x2="230" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3"/>
                <line x1="300" y1="70" x2="300" y2="30" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3"/>
                <text x="300" y="200" fill="#f59e0b" fontSize="14" fontWeight="bold" textAnchor="middle">Radiation</text>
                <text x="300" y="215" fill="#9ca3af" fontSize="10" textAnchor="middle">EM waves</text>
              </svg>
            ),
            description: "Three methods of heat transfer: Conduction (contact), Convection (fluid flow), Radiation (EM waves)"
          },
          { 
            name: "PV Diagram - Thermodynamic Processes",
            svg: (
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width="400" height="250" fill="#0f172a" />
                
                {/* Axes */}
                <line x1="50" y1="200" x2="350" y2="200" stroke="#9ca3af" strokeWidth="2"/>
                <line x1="50" y1="200" x2="50" y2="50" stroke="#9ca3af" strokeWidth="2"/>
                <text x="30" y="125" fill="#9ca3af" fontSize="12" transform="rotate(-90 30,125)">Pressure (P)</text>
                <text x="200" y="220" fill="#9ca3af" fontSize="12">Volume (V)</text>
                
                {/* Isothermal */}
                <path d="M 80 180 Q 150 120, 220 100 Q 290 80, 320 60" 
                      fill="none" stroke="#ef4444" strokeWidth="3"/>
                <text x="200" y="40" fill="#ef4444" fontSize="11" fontWeight="bold">Isothermal (T constant)</text>
                
                {/* Adiabatic */}
                <path d="M 80 180 Q 120 140, 180 120 Q 240 90, 320 50" 
                      fill="none" stroke="#3b82f6" strokeWidth="3"/>
                <text x="200" y="65" fill="#3b82f6" fontSize="11" fontWeight="bold">Adiabatic (Q=0)</text>
                
                {/* Isobaric */}
                <line x1="100" y1="160" x2="300" y2="160" stroke="#22c55e" strokeWidth="3"/>
                <text x="200" y="155" fill="#22c55e" fontSize="11" fontWeight="bold">Isobaric (P constant)</text>
                
                {/* Isochoric */}
                <line x1="120" y1="180" x2="120" y2="80" stroke="#f59e0b" strokeWidth="3"/>
                <text x="130" y="85" fill="#f59e0b" fontSize="11" fontWeight="bold">Isochoric (V constant)</text>
                
                {/* Title */}
                <text x="200" y="240" fill="#cbd5e1" fontSize="13" textAnchor="middle" fontWeight="bold">
                  PV Diagram: Different Thermodynamic Processes
                </text>
              </svg>
            ),
            description: "Pressure-Volume diagram showing isothermal, adiabatic, isobaric, and isochoric processes"
          },
          { 
            name: "Phase Change Diagram",
            svg: (
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width="400" height="250" fill="#0f172a" />
                
                {/* Temperature axis */}
                <line x1="50" y1="200" x2="350" y2="200" stroke="#9ca3af" strokeWidth="2"/>
                
                {/* Phase regions */}
                <rect x="50" y="150" width="80" height="50" fill="#1e3a8a" opacity="0.2" stroke="#1d4ed8" strokeWidth="1"/>
                <rect x="130" y="100" width="60" height="100" fill="#065f46" opacity="0.2" stroke="#059669" strokeWidth="1"/>
                <rect x="190" y="50" width="160" height="150" fill="#7c2d12" opacity="0.2" stroke="#dc2626" strokeWidth="1"/>
                
                {/* Phase boundaries */}
                <line x1="130" y1="150" x2="130" y2="200" stroke="#f59e0b" strokeWidth="2"/>
                <line x1="190" y1="100" x2="190" y2="200" stroke="#f59e0b" strokeWidth="2"/>
                
                {/* Labels */}
                <text x="90" y="190" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">Solid</text>
                <text x="160" y="190" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">Liquid</text>
                <text x="270" y="190" fill="#f97316" fontSize="12" fontWeight="bold" textAnchor="middle">Gas</text>
                
                {/* Process arrows */}
                <line x1="100" y1="170" x2="120" y2="170" stroke="#22c55e" strokeWidth="2"/>
                <polygon points="120,170 115,165 115,175" fill="#22c55e"/>
                <text x="90" y="165" fill="#22c55e" fontSize="10">Melting</text>
                
                <line x1="170" y1="170" x2="180" y2="170" stroke="#ef4444" strokeWidth="2"/>
                <polygon points="180,170 185,165 185,175" fill="#ef4444"/>
                <text x="150" y="165" fill="#ef4444" fontSize="10">Boiling</text>
                
                {/* Title */}
                <text x="200" y="230" fill="#cbd5e1" fontSize="13" textAnchor="middle" fontWeight="bold">
                  Phase Changes: Temperature vs Internal Energy
                </text>
              </svg>
            ),
            description: "Phase diagram showing solid, liquid, gas states and phase transitions with temperature"
          },
          { 
            name: "Carnot Cycle",
            svg: (
              <svg viewBox="0 0 400 250" className="w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width="400" height="250" fill="#0f172a" />
                
                {/* Cycle */}
                <path d="M 100 150 L 200 80 L 300 150 L 200 220 Z" 
                      fill="none" stroke="#8b5cf6" strokeWidth="3"/>
                
                {/* Process labels */}
                <text x="30" y="120" fill="#ef4444" fontSize="11" fontWeight="bold">Isothermal Expansion</text>
                <text x="250" y="100" fill="#3b82f6" fontSize="8" fontWeight="bold">Adiabatic Expansion</text>
                <text x="250" y="200" fill="#22c55e" fontSize="8" fontWeight="bold">Isothermal Compression</text>
                <text x="15" y="180" fill="#f59e0b" fontSize="11" fontWeight="bold">Adiabatic Compression</text>
                
                {/* Temperature labels */}
                <text x="180" y="70" fill="#dc2626" fontSize="12" fontWeight="bold">T₁ (Hot)</text>
                <text x="180" y="190" fill="#1d4ed8" fontSize="12" fontWeight="bold">T₂ (Cold)</text>
                
                {/* Heat and work */}
                <line x1="350" y1="80" x2="350" y2="150" stroke="#f59e0b" strokeWidth="2"/>
                <polygon points="350,80 345,90 355,90" fill="#f59e0b"/>
                <text x="360" y="115" fill="#f59e0b" fontSize="10">Q₁ IN</text>
                
                <line x1="350" y1="150" x2="350" y2="220" stroke="#3b82f6" strokeWidth="2"/>
                <polygon points="350,220 345,210 355,210" fill="#3b82f6"/>
                <text x="360" y="185" fill="#3b82f6" fontSize="10">Q₂ OUT</text>
                
                <line x1="320" y1="150" x2="350" y2="150" stroke="#22c55e" strokeWidth="2"/>
                <polygon points="320,150 330,145 330,155" fill="#22c55e"/>
                <text x="310" y="140" fill="#22c55e" fontSize="10">W OUT</text>
                
                {/* Title */}
                <text x="200" y="240" fill="#cbd5e1" fontSize="13" textAnchor="middle" fontWeight="bold">
                  Carnot Cycle: Maximum Efficiency Heat Engine
                </text>
              </svg>
            ),
            description: "Carnot cycle with two isothermal and two adiabatic processes - most efficient heat engine cycle"
          }
        ]
      },
{
        title: "Key Laws & Principles",
        expandableLaws: [
          {
            id: "zeroth-law",
            title: "Zeroth Law of Thermodynamics",
            formula: "If A = B and B = C, then A = C",
            definition: "If two systems are each in thermal equilibrium with a third system, then they are in thermal equilibrium with each other. This law establishes temperature as a fundamental property and allows for temperature measurement.",
            realLife: [
              "Thermometers - work because they reach thermal equilibrium with the object being measured",
              "Room temperature - all objects in a room eventually reach the same temperature",
              "Cooking - food reaches thermal equilibrium with its cooking environment"
            ],
            visual: (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="font-bold text-center mb-3">Thermal Equilibrium Principle</p>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
                      <p className="text-xs text-red-400 mt-1">System A</p>
                    </div>
                    <span className="text-2xl text-green-400">⇌</span>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">B</div>
                      <p className="text-xs text-blue-400 mt-1">System B</p>
                    </div>
                    <span className="text-2xl text-green-400">⇌</span>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">C</div>
                      <p className="text-xs text-yellow-400 mt-1">System C</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                    <p className="text-purple-300 font-mono text-lg">If A = B and B = C, then A = C</p>
                  </div>
                  <p className="mt-3 text-sm text-center text-gray-300">
                    Basis for temperature measurement and thermal equilibrium
                  </p>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "A, B, C", meaning: "Thermodynamic systems" },
              { symbol: "=", meaning: "Thermal equilibrium" },
              { symbol: "T", meaning: "Temperature (common property)" }
            ],
            sampleProblem: {
              question: "If thermometer A reads 25°C when in contact with object B, and the same thermometer reads 25°C when in contact with object C, what can you conclude about objects B and C?",
              given: [
                "Thermometer A reads 25°C with object B",
                "Thermometer A reads 25°C with object C"
              ],
              unknown: [
                "Relationship between B and C"
              ],
              solution: [
                "Step 1: Apply Zeroth Law of Thermodynamics",
                "If A = B (thermal equilibrium) and A = C (thermal equilibrium)",
                "Then B = C (thermal equilibrium)",
                "",
                "Step 2: Conclusion",
                "Objects B and C are in thermal equilibrium with each other",
                "They have the same temperature: 25°C"
              ],
              conclusion: "According to the Zeroth Law, objects B and C are in thermal equilibrium and have the same temperature of 25°C."
            },
            keyPoints: [
              "Establishes temperature as a measurable quantity",
              "Basis for thermometer operation and calibration",
              "Defines the concept of thermal equilibrium"
            ]
          },
          {
            id: "first-law-principle",
            title: "First Law of Thermodynamics",
            formula: "ΔU = Q - W",
            definition: "The change in internal energy of a system equals the heat added to the system minus the work done by the system. This is the principle of energy conservation applied to thermodynamic systems - energy cannot be created or destroyed, only converted from one form to another.",
            realLife: [
              "Car engines - convert heat from fuel combustion into mechanical work",
              "Refrigerators - use work to transfer heat from cold interior to warm exterior",
              "Human metabolism - converts chemical energy from food into body heat and mechanical work"
            ],
            visual: (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="font-bold text-center mb-3">Energy Conservation in Thermodynamics</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl">Q</div>
                      <p className="text-xs text-yellow-400 mt-1">Heat IN</p>
                    </div>
                    <span className="text-3xl text-green-400">=</span>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">ΔU</div>
                      <p className="text-xs text-green-400 mt-1">Energy Change</p>
                    </div>
                    <span className="text-3xl text-red-400">+</span>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">W</div>
                      <p className="text-xs text-blue-400 mt-1">Work OUT</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                    <p className="text-purple-300 font-mono text-xl">ΔU = Q - W</p>
                    <p className="text-gray-400 text-sm mt-1">Energy Conservation Equation</p>
                  </div>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "ΔU", meaning: "Change in internal energy (Joules)" },
              { symbol: "Q", meaning: "Heat added to system (Joules)" },
              { symbol: "W", meaning: "Work done by system (Joules)" }
            ],
            sampleProblem: {
              question: "A gas absorbs 800 J of heat and does 300 J of work on its surroundings. What is the change in its internal energy?",
              given: [
                "Q = +800 J (heat absorbed by system)",
                "W = +300 J (work done by system)"
              ],
              unknown: [
                "ΔU = ? (change in internal energy)"
              ],
              solution: [
                "Step 1: Apply First Law of Thermodynamics",
                "ΔU = Q - W",
                "",
                "Step 2: Substitute values",
                "ΔU = 800 J - 300 J",
                "ΔU = 500 J"
              ],
              conclusion: "The internal energy of the gas increases by 500 Joules. The system gained more energy from heat than it lost through work."
            },
            keyPoints: [
              "Energy conservation principle for thermodynamic systems",
              "Internal energy depends only on initial and final states",
              "Heat and work are path-dependent processes"
            ]
          },
          {
            id: "second-law-principle",
            title: "Second Law of Thermodynamics",
            formula: "ΔS_universe ≥ 0",
            definition: "The total entropy of an isolated system always increases over time, approaching a maximum value at equilibrium. Heat flows spontaneously from hotter to colder bodies, and natural processes tend toward greater disorder. This law defines the 'arrow of time' and limits the efficiency of heat engines.",
            realLife: [
              "Ice melting - ordered crystal structure becomes disordered liquid",
              "Perfume diffusion - concentrated molecules spread out evenly in a room",
              "Heat engines - always waste some energy as heat to the environment"
            ],
            visual: (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="font-bold text-center mb-3">Entropy: The Arrow of Time</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm text-center p-2">
                        Ordered State<br/>Low Entropy
                      </div>
                      <p className="text-xs text-blue-400 mt-1">Initial State</p>
                    </div>
                    <span className="text-3xl text-red-400">→</span>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm text-center p-2">
                        Disordered State<br/>High Entropy
                      </div>
                      <p className="text-xs text-red-400 mt-1">Final State</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-red-900/30 rounded-lg">
                    <p className="text-red-300 font-mono text-lg">ΔS_universe ≥ 0</p>
                    <p className="text-gray-400 text-sm mt-1">Entropy never decreases</p>
                  </div>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "ΔS", meaning: "Change in entropy (J/K)" },
              { symbol: "S_universe", meaning: "Total entropy of the universe" },
              { symbol: "≥", meaning: "Always greater than or equal to" }
            ],
            sampleProblem: {
              question: "Why can't a heat engine be 100% efficient according to the Second Law?",
              given: [
                "Second Law of Thermodynamics",
                "Heat engine operation principles"
              ],
              unknown: [
                "Reason for efficiency limitation"
              ],
              solution: [
                "Step 1: Understand Second Law implication",
                "All natural processes increase total entropy",
                "",
                "Step 2: Apply to heat engine",
                "Some heat must be rejected to a cold reservoir",
                "This increases entropy of the surroundings",
                "",
                "Step 3: Efficiency consequence",
                "Not all input heat can be converted to work",
                "Some energy must be wasted to increase entropy"
              ],
              conclusion: "A heat engine cannot be 100% efficient because it must reject some waste heat to increase the entropy of the universe, as required by the Second Law of Thermodynamics."
            },
            keyPoints: [
              "Defines the direction of natural processes",
              "Limits the maximum efficiency of heat engines",
              "Explains why perpetual motion machines are impossible"
            ]
          },
          {
            id: "third-law-principle",
            title: "Third Law of Thermodynamics",
            formula: "S → 0 as T → 0 K",
            definition: "The entropy of a perfect crystalline substance approaches zero as the temperature approaches absolute zero. This law provides an absolute reference point for entropy and implies that it's impossible to reach absolute zero in a finite number of steps.",
            realLife: [
              "Superconductivity - zero electrical resistance occurs at very low temperatures",
              "Liquid helium - exhibits quantum mechanical effects near absolute zero",
              "Cryogenics - study and use of materials at extremely low temperatures"
            ],
            visual: (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="font-bold text-center mb-3">Approaching Absolute Zero</p>
                  <div className="flex flex-col items-center justify-center mb-4">
                    <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2 border-4 border-cyan-400">
                      0 K
                    </div>
                    <div className="text-center">
                      <p className="text-cyan-400 font-bold">Perfect Order</p>
                      <p className="text-gray-400 text-sm">Entropy → 0</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                    <p className="text-cyan-300 font-mono text-lg">lim S = 0</p>
                    <p className="text-cyan-300 font-mono text-sm">T→0 K</p>
                    <p className="text-gray-400 text-sm mt-1">Absolute zero reference</p>
                  </div>
                </div>
              </div>
            ),
            symbols: [
              { symbol: "S", meaning: "Entropy (J/K)" },
              { symbol: "T", meaning: "Temperature (Kelvin)" },
              { symbol: "0 K", meaning: "Absolute zero (-273.15°C)" }
            ],
            sampleProblem: {
              question: "What is the significance of the Third Law for entropy calculations?",
              given: [
                "Third Law of Thermodynamics",
                "Entropy as a state function"
              ],
              unknown: [
                "Significance for entropy reference"
              ],
              solution: [
                "Step 1: Understand Third Law statement",
                "Entropy of perfect crystal approaches zero at 0 K",
                "",
                "Step 2: Implications for calculations",
                "Provides absolute zero reference point for entropy",
                "Allows calculation of absolute entropy values",
                "",
                "Step 3: Practical significance",
                "Enables tabulation of standard entropy values",
                "Useful in chemical thermodynamics calculations"
              ],
              conclusion: "The Third Law provides an absolute reference point (zero entropy at absolute zero) that allows scientists to calculate and tabulate absolute entropy values for substances, rather than just entropy changes."
            },
            keyPoints: [
              "Provides absolute reference for entropy measurements",
              "Perfect crystals have zero entropy at absolute zero",
              "Implies unattainability of absolute zero"
            ]
          }
        ]
      }
    ]
  }
};

  const getFilteredQuestions = (topicId) => {
    if (difficultyFilter === 'all') return allQuestions[topicId];
    const difficulty = difficultyFilter === 'easy' ? 1 : difficultyFilter === 'medium' ? 2 : 3;
    return allQuestions[topicId].filter(q => q.difficulty === difficulty);
  };

  const getRank = (points) => {
    if (points < 100) return { title: 'Beginner', icon: '🌱', color: 'text-green-400' };
    if (points < 300) return { title: 'Intermediate', icon: '🔬', color: 'text-blue-400' };
    if (points < 600) return { title: 'Advanced', icon: '⚛️', color: 'text-purple-400' };
    if (points < 1000) return { title: 'Master', icon: '🎓', color: 'text-yellow-400' };
    return { title: 'Grandmaster', icon: '👑', color: 'text-amber-400' };
  };

  const getBattleRank = (rating) => {
  if (rating < 500) return { title: 'Bronze', icon: '🥉', color: 'text-orange-400' };
  if (rating < 1000) return { title: 'Silver', icon: '🥈', color: 'text-gray-300' };
  if (rating < 1500) return { title: 'Gold', icon: '🥇', color: 'text-yellow-400' };
  if (rating < 2000) return { title: 'Platinum', icon: '💎', color: 'text-cyan-400' };
  if (rating < 2500) return { title: 'Diamond', icon: '🔷', color: 'text-blue-400' };
  return { title: 'Grandmaster', icon: '👑', color: 'text-purple-400' };
  };


  const handleAnswer = useCallback((answerIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(answerIndex);
    
    const questions = getFilteredQuestions(selectedTopic.id);
    const currentQ = questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correct;
    
    if (isCorrect) {
      const timeBonus = timeLeft >= 10 ? 10 : Math.floor(timeLeft / 3);
      const streakBonus = streak * 5;
      const difficultyBonus = currentQ.difficulty * 10;
      const multiplier = activePowerUp === 'doublePoints' ? 2 : 1;
      const points = (10 + timeBonus + streakBonus + difficultyBonus) * multiplier;
      setScore(prevScore => prevScore + points);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      
      if (timeLeft >= 10) {
        setFastAnswers(prev => prev + 1);
      }
    } else {
      setStreak(0);
    }
    
    if (activePowerUp === 'doublePoints') {
      setActivePowerUp(null);
    }
  }, [answered, selectedTopic, currentQuestion, timeLeft, streak, score, activePowerUp, maxStreak, difficultyFilter, getFilteredQuestions]);

  useEffect(() => {
    if (screen === 'quiz' && timeLeft > 0 && !answered && activePowerUp !== 'timeFreeze') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      handleAnswer(-1);
    }
  }, [timeLeft, screen, answered, activePowerUp, handleAnswer]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

const loadLeaderboard = async () => {
  try {
    const result = await storage.list('player:');
    if (result && result.keys) {
      const players = await Promise.all(
        result.keys.map(async key => {
          const data = await storage.get(key);
          return JSON.parse(data.value);
        })
      );
      
      // Training Leaderboard - SOLO PRACTICE
      const trainingLB = players
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10);
      setLeaderboard(trainingLB);

      // Battle Leaderboard - PVP RANKINGS  
      const battleLB = players
        .filter(p => p.battleStats && (p.battleStats.wins > 0 || p.battleStats.losses > 0)) // Only players with battle history
        .sort((a, b) => (b.battleStats?.rating || 0) - (a.battleStats?.rating || 0))
        .slice(0, 10);
      setBattleLeaderboard(battleLB);
    }
  } catch (error) {
    console.log('Storage error:', error);
    setLeaderboard([]);
    setBattleLeaderboard([]);
  }
};

  const handleRegister = async () => {
    if (userName.trim()) {
      try {
        const existingUser = await storage.get(`player:${userName}`);
        let player;
        if (existingUser) {
          player = JSON.parse(existingUser.value);
        } else {
          player = {
            name: userName,
            totalPoints: 0,
            gamesPlayed: 0,
            topicScores: {},
            avatar: avatars[0],
            achievements: [],
            history: []
          };
          await storage.set(`player:${userName}`, JSON.stringify(player));
        }
        setCurrentUser(player);
        setScreen('topics');
      } catch (error) {
        console.error('Storage error:', error);
        setCurrentUser({ name: userName, totalPoints: 0, gamesPlayed: 0, topicScores: {}, avatar: avatars[0], achievements: [], history: [] });
        setScreen('topics');
      }
    }
  };

  // Sa updateBattleLeaderboard function, dagdagan:
const updateBattleLeaderboard = async (playerWon, playerScore, opponentScore, wasComeback = false) => {
  try {
    const userData = await storage.get(`player:${currentUser.name}`);
    if (userData) {
      const user = JSON.parse(userData.value);
      
      // Initialize battle stats if not exists
      if (!user.battleStats) {
        user.battleStats = {
          wins: 0,
          losses: 0,
          rating: 1000,
          totalBattlePoints: 0,
          perfectWins: 0,
          comebacks: 0,
          currentWinStreak: 0
        };
      }
      
      // Update battle stats
      if (playerWon) {
        user.battleStats.wins += 1;
        user.battleStats.rating += 25;
        user.battleStats.currentWinStreak += 1;
        
        // ✅ Check for perfect battle
        if (playerScore >= (battleConfig.questionCount * 40)) { // Perfect score
          user.battleStats.perfectWins += 1;
        }
        
        // ✅ Check for comeback
        if (wasComeback) {
          user.battleStats.comebacks += 1;
        }
      } else {
        user.battleStats.losses += 1;
        user.battleStats.rating = Math.max(0, user.battleStats.rating - 15);
        user.battleStats.currentWinStreak = 0;
      }
      
      user.battleStats.totalBattlePoints = (user.battleStats.totalBattlePoints || 0) + playerScore;
      user.totalPoints = (user.totalPoints || 0) + playerScore;
      
      await storage.set(`player:${currentUser.name}`, JSON.stringify(user));
      await loadLeaderboard();
    }
  } catch (error) {
    console.log('Error updating battle leaderboard:', error);
  }
};

  const startQuiz = (topic) => {
    setSelectedTopic(topic);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setAnswered(false);
    setFastAnswers(0);
    setMaxStreak(0);
    setRemovedOptions([]);
    setActivePowerUp(null);
    setScreen('quiz');
  };

  const usePowerUp = (type) => {
    if (powerUps[type] <= 0 || answered) return;
    
    if (type === 'timeFreeze') {
      setActivePowerUp('timeFreeze');
      setPowerUps(prev => ({ ...prev, timeFreeze: prev.timeFreeze - 1 }));
      setTimeout(() => setActivePowerUp(null), 5000);
    } else if (type === 'fiftyFifty') {
      const questions = getFilteredQuestions(selectedTopic.id);
      const currentQ = questions[currentQuestion];
      const wrongOptions = currentQ.options
        .map((_, i) => i)
        .filter(i => i !== currentQ.correct);
      const toRemove = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setRemovedOptions(toRemove);
      setPowerUps(prev => ({ ...prev, fiftyFifty: prev.fiftyFifty - 1 }));
    } else if (type === 'doublePoints') {
      setActivePowerUp('doublePoints');
      setPowerUps(prev => ({ ...prev, doublePoints: prev.doublePoints - 1 }));
    }
  };

  const nextQuestion = () => {
    const questions = getFilteredQuestions(selectedTopic.id);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15);
      setAnswered(false);
      setSelectedAnswer(null);
      setRemovedOptions([]);
      if (activePowerUp === 'timeFreeze') setActivePowerUp(null);
    } else {
      finishQuiz();
    }
  };

  // ✅ FIXED: Enhanced finishQuiz with achievement tracking
  const finishQuiz = async () => {
    const questions = getFilteredQuestions(selectedTopic.id);
    const totalPossiblePoints = questions.length * 40;
    const accuracy = (score / totalPossiblePoints * 100).toFixed(1);
    const isPerfect = parseFloat(accuracy) === 100;
    
    const quizResult = {
      topic: selectedTopic.name,
      score,
      accuracy,
      date: new Date().toISOString(),
      difficulty: difficultyFilter,
      type: 'training'
    };
    
    const updatedUser = {
      ...currentUser,
      totalPoints: (currentUser.totalPoints || 0) + score,
      gamesPlayed: (currentUser.gamesPlayed || 0) + 1,
      topicScores: {
        ...(currentUser.topicScores || {}),
        [selectedTopic.id]: (currentUser.topicScores[selectedTopic.id] || 0) + score
      },
      history: [...(currentUser.history || []), quizResult].slice(-20),
      achievements: currentUser.achievements || []
    };

    // Initialize battle stats if not exists
    if (!updatedUser.battleStats) {
      updatedUser.battleStats = {
        wins: 0,
        losses: 0,
        rating: 1000,
        currentWinStreak: 0
      };
    }
    
    setUserProgress(prev => ({
      ...prev,
      [selectedTopic.id]: {
        ...prev[selectedTopic.id],
        total: (prev[selectedTopic.id]?.total || 0) + score,
        [difficultyFilter]: (prev[selectedTopic.id]?.[difficultyFilter] || 0) + 1
      }
    }));
    
    // ✅ FIXED: Check achievements with proper parameters
    const newAchievements = checkAchievements(updatedUser, null, fastAnswers, maxStreak);
    newAchievements.forEach(ach => {
      if (!updatedUser.achievements.includes(ach)) {
        updatedUser.achievements.push(ach);
        console.log(`🎉 Achievement unlocked: ${ach}`);
      }
    });
    
    if (isPerfect && !updatedUser.achievements.includes('perfect_score')) {
      updatedUser.achievements.push('perfect_score');
      console.log('🎉 Perfect score achievement unlocked!');
    }
    
    setCurrentUser(updatedUser);
    
    try {
      await storage.set(`player:${userName}`, JSON.stringify(updatedUser));
      await loadLeaderboard();
    } catch (error) {
      console.log('Storage error:', error);
    }
    
    setScreen('results');
  };

  const exportStats = () => {
    const rank = getRank(currentUser.totalPoints);
    const statsText = `Physics Mind Arena - Player Stats
================================
Name: ${currentUser.name}
Rank: ${rank.title}
Total Points: ${currentUser.totalPoints}
Games Played: ${currentUser.gamesPlayed}
Achievements: ${currentUser.achievements?.length || 0}/${achievements.length}

Topic Scores:
${Object.entries(currentUser.topicScores || {}).map(([topic, sc]) => `- ${topics.find(t => t.id === topic)?.name || topic}: ${sc} pts`).join('\n')}

Recent History:
${(currentUser.history || []).slice(-5).map(h => `${h.topic}: ${h.score} pts (${h.accuracy}%)`).join('\n')}`;
    
    const blob = new Blob([statsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userName}_physics_stats.txt`;
    a.click();
  };

  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'
    : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100';
  
  const cardClass = darkMode
    ? 'bg-slate-900/80 backdrop-blur-xl border-purple-500/30'
    : 'bg-white/80 backdrop-blur-xl border-purple-300';
  
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';


  useEffect(() => {
    if (screen === 'battle' && battleStep === 'quiz' && timeLeft > 0 && !playerAnswers[currentBattleQuestion]) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (screen === 'battle' && battleStep === 'quiz' && timeLeft === 0 && !playerAnswers[currentBattleQuestion]) {
      console.log('Time ran out! Auto-submitting...');
      if (battleQuestions[currentBattleQuestion]) {
        const currentAnswer = { 
          answerIndex: -1, 
          isCorrect: false, 
          timeTaken: battleConfig.timePerQuestion, 
          points: 0 
        };
        setPlayerAnswers(prev => {
          const newAnswers = [...prev];
          newAnswers[currentBattleQuestion] = currentAnswer;
          return newAnswers;
        });
      }
    }
  }, [timeLeft, battleStep, currentBattleQuestion, playerAnswers, screen, battleQuestions, battleConfig]);


  if (screen === 'welcome') {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
        <div className="w-full max-w-md">
          <div className={`${cardClass} rounded-3xl p-8 border shadow-2xl`}>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
              >
                {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-indigo-600" size={20} />}
              </button>
            </div>
            <div className="text-center mb-8">
              <Brain className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Physics Mind Arena</h1>
              <p className={darkMode ? 'text-purple-300' : 'text-purple-600'}>Ultimate Physics Competition</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-800 border-purple-500/30 text-white' : 'bg-white border-purple-300 text-gray-900'} border rounded-xl placeholder-gray-400 focus:outline-none focus:border-purple-500`}
              />
              <button
                onClick={handleRegister}
                disabled={!userName.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enter Arena <ChevronRight className="inline ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (screen === 'topics') {
  const rank = getRank(currentUser.totalPoints);
  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* User Header */}
        <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{currentUser.avatar}</div>
              <div>
                <h2 className={`text-2xl font-bold ${textClass} mb-1`}>Welcome, {currentUser.name}!</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`${rank.color} font-semibold`}>{rank.icon} {rank.title}</span>
                  <span className={textSecondary}>•</span>
                  <span className={`${darkMode ? 'text-purple-300' : 'text-purple-600'} flex items-center gap-1`}>
                    <Zap size={16} /> {currentUser.totalPoints} Energy
                  </span>
                  <span className={textSecondary}>•</span>
                  <span className={`${darkMode ? 'text-cyan-300' : 'text-cyan-600'} flex items-center gap-1`}>
                    <Medal size={16} /> {currentUser.achievements?.length || 0}/{achievements.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setScreen('study')} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all flex items-center gap-2 text-white text-sm">
                <Brain size={18} />Study
              </button>
              <button onClick={() => setScreen('achievements')} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-all flex items-center gap-2 text-white text-sm">
                <Medal size={18} />Badges
              </button>
              <button onClick={() => setScreen('leaderboard')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all flex items-center gap-2 text-white text-sm">
                <Trophy size={18} />Leaderboard
              </button>
              <button onClick={exportStats} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all flex items-center gap-2 text-white text-sm">
                <Download size={18} />Export
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition-all`}>
                {darkMode ? <Sun className="text-yellow-400" size={18} /> : <Moon className="text-indigo-600" size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className={`text-lg font-bold ${textClass}`}>Difficulty Filter</h3>
            <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
              {['all', 'easy', 'medium', 'hard'].map(level => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                    difficultyFilter === level
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : darkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Filter size={14} />
                  <span className="text-sm">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Dashboard */}
        <ProgressDashboard 
          currentUser={currentUser} 
          darkMode={darkMode} 
          topics={topics} 
        />

        {/* Training Ground */}
        <h3 className={`text-xl font-bold ${textClass} mb-4`}>🎯 Training Ground</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {topics.map(topic => {
            const questionCount = getFilteredQuestions(topic.id).length;
            return (
              <button
                key={topic.id}
                onClick={() => startQuiz(topic)}
                disabled={questionCount === 0}
                className={`${cardClass} rounded-2xl p-6 border hover:border-purple-500 transition-all text-left hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">{topic.icon}</span>
                  <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${topic.color} text-white text-xs font-semibold`}>
                    {questionCount} Questions
                  </div>
                </div>
                <h4 className={`text-xl font-bold ${textClass} mb-2`}>{topic.name}</h4>
                <p className={`${textSecondary} text-sm mb-3`}>{topic.description}</p>
                <div className={`flex items-center gap-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'} text-sm`}>
                  <Target size={16} />
                  <span>Best: {currentUser.topicScores[topic.id] || 0} pts</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* BATTLE ARENA BUTTON - REPLACED THE COMING SOON SECTION */}
        <div className={`${cardClass} rounded-2xl p-6 border text-center`}>
          <h3 className={`text-2xl font-bold ${textClass} mb-3 flex items-center justify-center gap-2`}>
            <Swords className={darkMode ? 'text-red-400' : 'text-red-600'} />
            Ready for Battle?
          </h3>
          <p className={`${textSecondary} mb-4`}>Test your skills against other players in real-time 1v1 physics duels!</p>
          <button 
            onClick={() => setScreen('battle')} 
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-3"
          >
            <Swords size={24} />
            ⚔️ Enter Battle Arena
            <Swords size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

if (screen === 'battle') {

  // Available configuration options
  const configOptions = {
    questionCounts: [3, 5, 7, 10],
    timeLimits: [15, 30, 45, 60],
    difficulties: [
      { id: 'mixed', name: 'Mixed Difficulty', icon: '🎲' },
      { id: 'easy', name: 'Easy Only', icon: '😊' },
      { id: 'medium', name: 'Medium Only', icon: '😐' },
      { id: 'hard', name: 'Hard Only', icon: '🔥' }
    ],
    questionTypes: [
      { id: 'problemSolving', name: 'Problem Solving', icon: '🧮', description: 'Calculation-based questions' },
      { id: 'concepts', name: 'Concepts', icon: '💡', description: 'Theory and principles' },
      { id: 'definitions', name: 'Definitions', icon: '📖', description: 'Key terms and definitions' }
    ]
  };




const getBattleQuestions = (topic) => {
  console.log('=== GET BATTLE QUESTIONS FOR TOPIC START ===');
  console.log('Topic parameter:', topic.name, 'ID:', topic.id);
  
  if (!topic) {
    console.error('❌ No topic provided!');
    return getFallbackQuestions();
  }

  // ✅ FIXED: Use the provided topic parameter, not state
  let questions = [];
  
  // Get questions ONLY from the provided topic
  if (allQuestions[topic.id]) {
    questions = [...allQuestions[topic.id]];
    console.log(`📚 Using ONLY ${topic.name} questions: ${questions.length} total`);
  } else {
    console.error(`❌ No questions found for topic: ${topic.id}`);
    return getFallbackQuestions(topic);
  }

  // Filter by difficulty
  if (battleConfig.difficulty !== 'mixed') {
    const difficultyMap = { easy: 1, medium: 2, hard: 3 };
    const originalCount = questions.length;
    questions = questions.filter(q => q.difficulty === difficultyMap[battleConfig.difficulty]);
    console.log(`🎯 Difficulty filter: ${originalCount} -> ${questions.length} questions`);
  }

  // Filter by question type
  const originalCount = questions.length;
  const filteredQuestions = questions.filter(q => {
    const isProblem = battleConfig.questionTypes.problemSolving && q.solution?.type === 'problem';
    const isConcept = battleConfig.questionTypes.concepts && q.solution?.type === 'concept';
    const isDefinition = battleConfig.questionTypes.definitions && (q.solution?.type === 'definition' || (!q.solution?.type && q.difficulty === 1));
    
    return isProblem || isConcept || isDefinition;
  });

  console.log(`📊 Type filter: ${originalCount} -> ${filteredQuestions.length} questions`);

  // Select random questions
  const selectedQuestions = filteredQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, battleConfig.questionCount)
    .map(q => ({ 
      ...q, 
      startTime: Date.now(),
      topic: topic.id,
      topicName: topic.name
    }));

  console.log(`🎲 Final selection: ${selectedQuestions.length} questions from ${topic.name}`);
  
  if (selectedQuestions.length === 0) {
    console.error('❌ NO QUESTIONS SELECTED! Using fallback questions.');
    return getFallbackQuestions(topic);
  }

  console.log('✅ SUCCESS: All questions belong to correct topic');
  console.log('=== GET BATTLE QUESTIONS FOR TOPIC END ===');
  
  return selectedQuestions;
};


const getFallbackQuestions = () => {
  console.log('🔄 Using fallback questions');
  
  // Use the selected topic if available, otherwise mechanics
  const fallbackTopic = selectedTopic || { id: 'mechanics', name: 'Mechanics' };
  
  if (!allQuestions[fallbackTopic.id]) {
    console.error(`❌ Fallback topic ${fallbackTopic.id} not found! Using mechanics.`);
    fallbackTopic.id = 'mechanics';
    fallbackTopic.name = 'Mechanics';
  }
  
  const fallbackQuestions = allQuestions[fallbackTopic.id]?.slice(0, battleConfig.questionCount) || [];
  
  console.log(`Fallback: Using ${fallbackQuestions.length} questions from ${fallbackTopic.name}`);
  
  return fallbackQuestions.map(q => ({ 
    ...q, 
    startTime: Date.now(),
    topic: fallbackTopic.id,
    topicName: fallbackTopic.name
  }));
};

const spinWheel = () => {
  setBattleStep('spinning');
  
  setTimeout(() => {
    // ✅ FIXED: Only use topics that are selected in battleConfig
    const availableTopics = topics.filter(topic => battleConfig.topics.includes(topic.id));
    
    if (availableTopics.length === 0) {
      console.error('No topics available in battle config! Using all topics as fallback');
      availableTopics.push(...topics);
    }
    
    const randomTopics = [...availableTopics].sort(() => 0.5 - Math.random()).slice(0, 4);
    const selected = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    
    console.log('🎡 Wheel selected topic:', selected.name, 'ID:', selected.id);
    
    // ✅ FIXED: Get questions for the selected topic BEFORE setting state
    const battleQuestions = getBattleQuestions(selected);
    
    console.log('🔍 Questions verification:');
    battleQuestions.forEach((q, i) => {
      console.log(`Q${i+1}: ${q.topicName} - ${q.q.substring(0, 40)}...`);
    });

    // ✅ FIXED: Set ALL states together to avoid timing issues
    setSelectedTopic(selected);
    setBattleQuestions(battleQuestions);
    setBattleStep('quiz');
    setCurrentQuestionStartTime(Date.now());
    setTimeLeft(battleConfig.timePerQuestion);
    
    // Reset scores
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerTimes([]);
    setPlayerAnswers([]);
    
    console.log('⚔️ Battle started!');
    console.log('Topic:', selected.name, 'Questions:', battleQuestions.length);
  }, 2000);
};


  // ✅ DITO MO ILAGAY ANG MULTIPLAYER FUNCTIONS
  const createGameRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(newRoomCode);
    setIsHost(true);
    setConnectedPlayers([currentUser.name]);
    setWaitingForPlayer(true);
    
    mockWebSocket.createRoom(newRoomCode, currentUser.name);
    console.log(`Room created: ${newRoomCode}`);
  };

  const joinGameRoom = (code) => {
    setRoomCode(code);
    setIsHost(false);
    
    const success = mockWebSocket.joinRoom(code, currentUser.name);
    if (success) {
      setConnectedPlayers([mockWebSocket.rooms[code].host, currentUser.name]);
      setWaitingForPlayer(true);
      console.log(`Joined room: ${code}`);
    } else {
      alert('Room not found or game already started!');
    }
  };

  const startMultiplayerGame = () => {
    const battleQuestions = getBattleQuestions();
    setBattleQuestions(battleQuestions);
    setBattleStep('quiz');
    setCurrentQuestionStartTime(Date.now());
    setTimeLeft(battleConfig.timePerQuestion);
    
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerTimes([]);
    setPlayerAnswers([]);
    setWaitingForPlayer(false);
    
    mockWebSocket.startGame(roomCode, battleQuestions);
  };

const handleBattleAnswer = (answerIndex) => {
  if (multiplayerMode === 'local') {
    if (showAnswer) return; // Prevent answering after reveal
    
    const currentQ = battleQuestions[currentBattleQuestion];
    const isCorrect = answerIndex === currentQ.correct;
    
    // Scoring calculation
    const timeBonus = timeLeft >= 10 ? 10 : Math.floor(timeLeft / 3);
    const difficultyBonus = currentQ.difficulty * 10;
    const basePoints = isCorrect ? 10 : 0;
    const totalPoints = basePoints + timeBonus + difficultyBonus;
    
    // Save answer for current player
    if (currentPlayer === 'p1') {
      setPlayer1Answers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentBattleQuestion] = { 
          answerIndex, 
          isCorrect, 
          points: totalPoints 
        };
        return newAnswers;
      });
      setPlayer1Score(prev => prev + totalPoints);
    } else {
      setPlayer2Answers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentBattleQuestion] = { 
          answerIndex, 
          isCorrect, 
          points: totalPoints 
        };
        return newAnswers;
      });
      setPlayer2Score(prev => prev + totalPoints);
    }
    
    // Show the correct answer
    setShowAnswer(true);
    
  } else {
    // VS AI LOGIC - KEEP YOUR EXISTING CODE HERE
    if (playerAnswers[currentBattleQuestion] !== undefined) return;

    const endTime = Date.now();
    const timeTaken = (endTime - currentQuestionStartTime) / 1000;
    
    const currentQ = battleQuestions[currentBattleQuestion];
    const isCorrect = answerIndex === currentQ.correct;
    
    // PLAYER SCORING
    const timeBonus = timeLeft >= 10 ? 10 : Math.floor(timeLeft / 3);
    const streakBonus = playerAnswers.filter(a => a?.isCorrect).length * 5;
    const difficultyBonus = currentQ.difficulty * 10;
    const basePoints = isCorrect ? 10 : 0;
    const totalPoints = basePoints + timeBonus + streakBonus + difficultyBonus;
    
    setPlayerScore(prev => prev + totalPoints);
    setPlayerTimes(prev => [...prev, timeTaken]);
    setPlayerAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentBattleQuestion] = { 
        answerIndex, 
        isCorrect, 
        timeTaken, 
        points: totalPoints
      };
      return newAnswers;
    });

    // ✅ IMPROVED AI OPPONENT - More Consistent
    const aiSkillLevel = 0.7; // 70% base accuracy (adjustable)
    const timeVariation = 0.8 + (Math.random() * 0.4); // 80-120% of player time
    
    const opponentTime = timeTaken * timeVariation;
    const difficultyFactor = currentQ.difficulty * 0.1; // Harder questions = AI struggles more
    const opponentCorrect = Math.random() < (aiSkillLevel - difficultyFactor);
    
    // Same scoring calculation
    const opponentTimeLeft = battleConfig.timePerQuestion - opponentTime;
    const opponentTimeBonus = opponentTimeLeft >= 10 ? 10 : Math.floor(opponentTimeLeft / 3);
    const opponentStreakBonus = Math.floor(Math.random() * 2) * 5; // Smaller random streak
    const opponentBasePoints = opponentCorrect ? 10 : 0;
    
    const opponentPoints = opponentBasePoints + opponentTimeBonus + opponentStreakBonus + difficultyBonus;
    
    // ✅ SET OPPONENT SCORE IMMEDIATELY - No delay, no fluctuation
    setOpponentScore(prev => prev + opponentPoints);
    
    console.log(`🎯 Q${currentBattleQuestion + 1}: Player=${totalPoints}pts, Opponent=${opponentPoints}pts`);
    console.log(`🤖 AI: ${opponentCorrect ? 'CORRECT' : 'WRONG'}, ${opponentTime.toFixed(1)}s`);
  }
};

  const nextPlayerOrQuestion = () => {
    if (multiplayerMode === 'local') {
      if (currentPlayer === 'p1') {
        // Switch to Player 2
        setCurrentPlayer('p2');
        setShowAnswer(false);
        setTimeLeft(battleConfig.timePerQuestion);
        setCurrentQuestionStartTime(Date.now());
      } else {
        // Both players answered, move to next question
        setCurrentPlayer('p1');
        setShowAnswer(false);
        
        if (currentBattleQuestion < battleQuestions.length - 1) {
          setCurrentBattleQuestion(prev => prev + 1);
          setTimeLeft(battleConfig.timePerQuestion);
          setCurrentQuestionStartTime(Date.now());
        } else {
          // End of battle
          setTimeout(() => {
            setShowBattleResults(true);
            setBattleStep('results');
          }, 1000);
        }
      }
    } else {
      // VS AI - use existing next question logic
      if (currentBattleQuestion < battleQuestions.length - 1) {
        setCurrentBattleQuestion(prev => prev + 1);
        setCurrentQuestionStartTime(Date.now());
        setTimeLeft(battleConfig.timePerQuestion);
      } else {
        setTimeout(() => {
          setShowBattleResults(true);
          setBattleStep('results');
        }, 1000);
      }
    }
  };

  // Move to next question or finish battle
  const nextBattleQuestion = () => {
    if (currentBattleQuestion < battleQuestions.length - 1) {
      setCurrentBattleQuestion(prev => prev + 1);
      setCurrentQuestionStartTime(Date.now());
      setTimeLeft(battleConfig.timePerQuestion);
    } else {
      setTimeout(() => {
        setShowBattleResults(true);
        setBattleStep('results');
      }, 1000);
    }
  };

  // Update configuration
  const updateConfig = (key, value) => {
    setBattleConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update question types
  const toggleQuestionType = (type) => {
    setBattleConfig(prev => ({
      ...prev,
      questionTypes: {
        ...prev.questionTypes,
        [type]: !prev.questionTypes[type]
      }
    }));
  };

  // Toggle topic selection
  const toggleTopic = (topicId) => {
    setBattleConfig(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(id => id !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  // Restart battle
  const restartBattle = () => {
    // Reset local multiplayer states
    if (multiplayerMode === 'local') {
      setPlayer1Score(0);
      setPlayer2Score(0);
      setPlayer1Answers([]);
      setPlayer2Answers([]);
      setCurrentPlayer('p1');
      setShowAnswer(false);
    }
    
    setBattleStep('setup');
    setSelectedTopic(null);
    setOpponentName('');
    setBattleQuestions([]);
    setCurrentBattleQuestion(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerTimes([]);
    setPlayerAnswers([]);
    setShowBattleResults(false);
    setTimeLeft(battleConfig.timePerQuestion);
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-3xl font-bold ${textClass} flex items-center gap-3`}>
              ⚔️ Battle Arena
            </h2>
            <button 
              onClick={() => setScreen('topics')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all text-white"
            >
              Exit Battle
            </button>
          </div>
        </div>

        {/* Setup Step */}
        {battleStep === 'setup' && (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className={`${cardClass} rounded-2xl p-6 border`}>
              <h3 className={`text-2xl font-bold ${textClass} mb-4`}>Select Battle Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* VS AI */}
                <button
                  onClick={() => setMultiplayerMode('none')}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    multiplayerMode === 'none'
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                      : `${darkMode ? 'bg-slate-800 border-purple-500/30 text-white' : 'bg-white border-purple-300 text-gray-900'} hover:border-purple-500`
                  }`}
                >
                  <div className="text-4xl mb-3">🤖</div>
                  <h4 className="text-lg font-bold mb-2">VS AI</h4>
                  <p className="text-sm opacity-80">Practice against computer opponent</p>
                </button>

                {/* Local Multiplayer */}
                <button
                  onClick={() => setMultiplayerMode('local')}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    multiplayerMode === 'local'
                      ? 'bg-green-600 border-green-500 text-white shadow-lg'
                      : `${darkMode ? 'bg-slate-800 border-green-500/30 text-white' : 'bg-white border-green-300 text-gray-900'} hover:border-green-500`
                  }`}
                >
                  <div className="text-4xl mb-3">📱</div>
                  <h4 className="text-lg font-bold mb-2">Local Multiplayer</h4>
                  <p className="text-sm opacity-80">Pass & play on same device</p>
                </button>

                {/* Online Multiplayer */}
                <button
                  onClick={() => setMultiplayerMode('online')}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    multiplayerMode === 'online'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                      : `${darkMode ? 'bg-slate-800 border-blue-500/30 text-white' : 'bg-white border-blue-300 text-gray-900'} hover:border-blue-500`
                  }`}
                >
                  <div className="text-4xl mb-3">🌐</div>
                  <h4 className="text-lg font-bold mb-2">Online Multiplayer</h4>
                  <p className="text-sm opacity-80">Play with friends on different devices</p>
                </button>
              </div>
            </div>

            {/* Configuration based on mode */}
            {multiplayerMode === 'online' ? (
              <MultiplayerSetup
                darkMode={darkMode}
                onBack={() => setMultiplayerMode('none')}
                onCreateRoom={createGameRoom}
                onJoinRoom={joinGameRoom}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className={`${cardClass} rounded-2xl p-6 border lg:col-span-2`}>
                  <h3 className={`text-2xl font-bold ${textClass} mb-6`}>Battle Configuration</h3>
                  
                  <div className="space-y-8">
                    {/* Question Count */}
                    <div>
                      <h4 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                        📊 Number of Questions
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {configOptions.questionCounts.map(count => (
                          <button
                            key={count}
                            onClick={() => updateConfig('questionCount', count)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              battleConfig.questionCount === count
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                                : `${darkMode ? 'bg-slate-800 border-purple-500/30 text-white' : 'bg-white border-purple-300 text-gray-900'} hover:border-purple-500`
                            }`}
                          >
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-sm opacity-80">Questions</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Limit */}
                    <div>
                      <h4 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                        ⏱️ Time Per Question
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {configOptions.timeLimits.map(time => (
                          <button
                            key={time}
                            onClick={() => updateConfig('timePerQuestion', time)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              battleConfig.timePerQuestion === time
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                                : `${darkMode ? 'bg-slate-800 border-blue-500/30 text-white' : 'bg-white border-blue-300 text-gray-900'} hover:border-blue-500`
                            }`}
                          >
                            <div className="text-2xl font-bold">{time}</div>
                            <div className="text-sm opacity-80">Seconds</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <h4 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                        🎯 Difficulty Level
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {configOptions.difficulties.map(diff => (
                          <button
                            key={diff.id}
                            onClick={() => updateConfig('difficulty', diff.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              battleConfig.difficulty === diff.id
                                ? 'bg-green-600 border-green-500 text-white shadow-lg'
                                : `${darkMode ? 'bg-slate-800 border-green-500/30 text-white' : 'bg-white border-green-300 text-gray-900'} hover:border-green-500`
                            }`}
                          >
                            <div className="text-2xl mb-1">{diff.icon}</div>
                            <div className="font-semibold text-sm">{diff.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question Types */}
                    <div>
                      <h4 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                        🎨 Question Types
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {configOptions.questionTypes.map(type => (
                          <button
                            key={type.id}
                            onClick={() => toggleQuestionType(type.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              battleConfig.questionTypes[type.id]
                                ? 'bg-yellow-600 border-yellow-500 text-white shadow-lg'
                                : `${darkMode ? 'bg-slate-800 border-yellow-500/30 text-white' : 'bg-white border-yellow-300 text-gray-900'} hover:border-yellow-500`
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{type.icon}</span>
                              <div>
                                <div className="font-semibold">{type.name}</div>
                                <div className="text-xs opacity-80">{type.description}</div>
                              </div>
                            </div>
                            <div className={`text-xs ${battleConfig.questionTypes[type.id] ? 'text-yellow-200' : textSecondary}`}>
                              {battleConfig.questionTypes[type.id] ? '✓ Enabled' : 'Click to enable'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Topics Selection */}
                    <div>
                      <h4 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                        📚 Topics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {topics.map(topic => (
                          <button
                            key={topic.id}
                            onClick={() => toggleTopic(topic.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              battleConfig.topics.includes(topic.id)
                                ? 'bg-pink-600 border-pink-500 text-white shadow-lg'
                                : `${darkMode ? 'bg-slate-800 border-pink-500/30 text-white' : 'bg-white border-pink-300 text-gray-900'} hover:border-pink-500`
                            }`}
                          >
                            <div className="text-2xl mb-2">{topic.icon}</div>
                            <div className="font-semibold text-sm">{topic.name}</div>
                            <div className={`text-xs mt-1 ${
                              battleConfig.topics.includes(topic.id) ? 'text-pink-200' : textSecondary
                            }`}>
                              {battleConfig.topics.includes(topic.id) ? '✓ Selected' : 'Click to select'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Battle Setup Panel */}
                <div className={`${cardClass} rounded-2xl p-6 border`}>
                  <h3 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>
                    {multiplayerMode === 'local' ? '👥 Local Battle' : 'Ready for Battle?'}
                  </h3>

                  <div className="space-y-6">
                    {/* Player 2 Name for local multiplayer */}
                    {multiplayerMode === 'local' && (
                      <div>
                        <label className={`block font-semibold ${textClass} mb-2`}>
                          Player 2 Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Player 2 name..."
                          value={player2Name}
                          onChange={(e) => setPlayer2Name(e.target.value)}
                          className={`w-full px-4 py-3 ${
                            darkMode ? 'bg-slate-800 border-green-500/30 text-white' : 'bg-white border-green-300 text-gray-900'
                          } border rounded-xl placeholder-gray-400 focus:outline-none focus:border-green-500`}
                        />
                      </div>
                    )}

                    {/* Opponent Name for VS AI */}
                    {multiplayerMode === 'none' && (
                      <div>
                        <label className={`block font-semibold ${textClass} mb-2`}>
                          Opponent Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter opponent name..."
                          value={opponentName}
                          onChange={(e) => setOpponentName(e.target.value)}
                          className={`w-full px-4 py-3 ${
                            darkMode ? 'bg-slate-800 border-purple-500/30 text-white' : 'bg-white border-purple-300 text-gray-900'
                          } border rounded-xl placeholder-gray-400 focus:outline-none focus:border-purple-500`}
                        />
                      </div>
                    )}

                    {/* Battle Summary */}
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                      <h4 className={`font-bold ${textClass} mb-3`}>Battle Summary:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={textSecondary}>Mode:</span>
                          <span className={textClass}>
                            {multiplayerMode === 'online' ? '🌐 Online' : 
                            multiplayerMode === 'local' ? '👥 Local' : '🤖 VS AI'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={textSecondary}>Questions:</span>
                          <span className={textClass}>{battleConfig.questionCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={textSecondary}>Time per question:</span>
                          <span className={textClass}>{battleConfig.timePerQuestion}s</span>
                        </div>
                      </div>
                    </div>

                    {/* Start Battle Button */}
                    <button
                      onClick={spinWheel}
                      disabled={
                        (multiplayerMode === 'none' && !opponentName.trim()) ||
                        (multiplayerMode === 'local' && !player2Name.trim()) ||
                        !battleConfig.topics.length || 
                        !Object.values(battleConfig.questionTypes).some(Boolean)
                      }
                      className={`w-full py-4 rounded-xl font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                        multiplayerMode === 'online' ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/50' :
                        multiplayerMode === 'local' ? 'bg-green-600 hover:bg-green-500 hover:shadow-green-500/50' :
                        'bg-red-600 hover:bg-red-500 hover:shadow-red-500/50'
                      }`}
                    >
                      <Swords size={24} />
                      {multiplayerMode === 'online' ? '🌐 Find Match' : 
                      multiplayerMode === 'local' ? '👥 Start Local Battle' : '🎡 Spin & Start Battle'}
                      <Swords size={24} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Spinning Step */}
        {battleStep === 'spinning' && (
          <SpinWheel 
            topics={topics.filter(t => battleConfig.topics.includes(t.id))}
            onTopicSelected={setSelectedTopic}
            darkMode={darkMode}
            isSpinning={true}
          />
        )}

        {/* Quiz Step */}
        {battleStep === 'quiz' && selectedTopic && battleQuestions.length > 0 && (
          <div className="space-y-6">
            {/* Battle Header - UPDATED FOR LOCAL MULTIPLAYER */}
            {multiplayerMode === 'local' ? (
              <div className={`${cardClass} rounded-2xl p-6 border`}>
                <div className="flex justify-between items-center mb-4">
                  {/* Player 1 */}
                  <div className={`text-center ${currentPlayer === 'p1' ? 'ring-4 ring-green-500 rounded-xl p-3' : ''}`}>
                    <div className={`text-2xl font-bold ${textClass}`}>{currentUser.name}</div>
                    <div className={`text-lg font-bold ${currentPlayer === 'p1' ? 'text-green-400 animate-pulse' : 'text-green-400'}`}>
                      {player1Score} pts
                    </div>
                    <div className="text-xs text-green-300 mt-1">
                      {currentPlayer === 'p1' ? '🎯 Your Turn!' : 'Waiting...'}
                    </div>
                  </div>
                  
                  {/* QUESTION INFO & TIMER */}
                  <div className="text-center">
                    <div className={`text-sm ${textSecondary}`}>
                      Question {currentBattleQuestion + 1}/{battleQuestions.length}
                    </div>
                    <div className={`text-xl font-bold ${
                      timeLeft <= 10 ? 'text-red-400 animate-pulse' : 
                      timeLeft <= 20 ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {timeLeft}s
                    </div>
                    {showAnswer && (
                      <div className="text-xs text-blue-300 mt-1">
                        Check answer!
                      </div>
                    )}
                  </div>
                  
                  {/* Player 2 */}
                  <div className={`text-center ${currentPlayer === 'p2' ? 'ring-4 ring-blue-500 rounded-xl p-3' : ''}`}>
                    <div className={`text-2xl font-bold ${textClass}`}>{player2Name}</div>
                    <div className={`text-lg font-bold ${currentPlayer === 'p2' ? 'text-blue-400 animate-pulse' : 'text-blue-400'}`}>
                      {player2Score} pts
                    </div>
                    <div className="text-xs text-blue-300 mt-1">
                      {currentPlayer === 'p2' ? '🎯 Your Turn!' : 'Waiting...'}
                    </div>
                  </div>
                </div>
                
                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((currentBattleQuestion + 1) / battleQuestions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Turn Indicator */}
                <div className={`text-center mt-4 p-3 rounded-xl ${
                  currentPlayer === 'p1' 
                    ? 'bg-green-900/20 border border-green-500/30' 
                    : 'bg-blue-900/20 border border-blue-500/30'
                }`}>
                  <p className={`font-bold ${currentPlayer === 'p1' ? 'text-green-300' : 'text-blue-300'}`}>
                    {currentPlayer === 'p1' 
                      ? `👆 ${currentUser.name}'s Turn - Answer Now!` 
                      : `👇 ${player2Name}'s Turn - Pass the Device!`
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className={`${cardClass} rounded-2xl p-6 border`}>
                <div className="flex justify-between items-center mb-4">
                  {/* PLAYER SCORE */}
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${textClass}`}>{currentUser.name}</div>
                    <div className={`text-lg font-bold text-green-400`}>{playerScore} pts</div>
                    {playerAnswers[currentBattleQuestion] && (
                      <div className="text-xs text-green-300 mt-1">
                        +{playerAnswers[currentBattleQuestion]?.points} pts
                      </div>
                    )}
                  </div>
                  
                  {/* QUESTION INFO & TIMER */}
                  <div className="text-center">
                    <div className={`text-sm ${textSecondary}`}>
                      Question {currentBattleQuestion + 1}/{battleQuestions.length}
                    </div>
                    <div className={`text-xl font-bold ${
                      timeLeft <= 10 ? 'text-red-400 animate-pulse' : 
                      timeLeft <= 20 ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {timeLeft}s
                    </div>
                    {playerAnswers[currentBattleQuestion] && (
                      <div className="text-xs text-blue-300 mt-1">
                        Time: {playerAnswers[currentBattleQuestion]?.timeTaken.toFixed(1)}s
                      </div>
                    )}
                  </div>
                  
                  {/* OPPONENT SCORE */}
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${textClass}`}>{opponentName}</div>
                    <div className={`text-lg font-bold text-red-400`}>{opponentScore} pts</div>
                    {playerAnswers[currentBattleQuestion] && (
                      <div className="text-xs text-red-300 mt-1">
                        +{Math.floor(Math.random() * 80) + 20} pts
                      </div>
                    )}
                  </div>
                </div>
                
                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((currentBattleQuestion + 1) / battleQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

                <div className={`${cardClass} rounded-xl p-3 border border-yellow-500/30 bg-yellow-900/10`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-400">
                    🔍 Debug: Topic: {selectedTopic.name} | 
                    Questions: {battleQuestions.length} | 
                    Verified: {battleQuestions.filter(q => q.topic === selectedTopic.id).length}/{battleQuestions.length}
                  </span>
                </div>
              </div>

            {/* Timer Effects - ENHANCED */}
            {timeLeft <= 10 && (
              <div className="text-center">
                <div className={`font-bold text-lg animate-pulse ${
                  timeLeft <= 5 ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {timeLeft <= 5 ? '⚡' : '⚠️'} {timeLeft} seconds left!
                </div>
              </div>
            )}

            {/* Question */}
            <div className={`${cardClass} rounded-2xl p-8 border`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedTopic.icon}</span>
                <div>
                  <h4 className={`text-xl font-bold ${textClass}`}>{selectedTopic.name}</h4>
                  <p className={textSecondary}>
                    {battleQuestions[currentBattleQuestion].solution?.type === 'problem' ? '🧮 Problem Solving' :
                    battleQuestions[currentBattleQuestion].solution?.type === 'concept' ? '💡 Concept' :
                    '📖 Definition'}
                  </p>
                </div>
              </div>

              <h4 className={`text-2xl font-semibold ${textClass} mb-6`}>
                {battleQuestions[currentBattleQuestion].q}
              </h4>

              {/* 👇 DITO MO ILALAGAY YUNG UPDATED QUESTION OPTIONS GRID 👇 */}
              <div className="grid grid-cols-1 gap-4">
                {battleQuestions[currentBattleQuestion].options.map((option, index) => {
                  const currentQ = battleQuestions[currentBattleQuestion];
                  const isCorrect = index === currentQ.correct;
                  
                  let optionClass = darkMode 
                    ? 'bg-slate-800 border-purple-500/30 text-white hover:bg-purple-700' 
                    : 'bg-white border-purple-300 text-gray-900 hover:bg-purple-100';
                  
                  if (showAnswer || (multiplayerMode !== 'local' && playerAnswers[currentBattleQuestion])) {
                    if (isCorrect) {
                      optionClass = 'bg-green-600 border-green-700 text-white';
                    } else if (
                      (multiplayerMode === 'local' && currentPlayer === 'p1' && player1Answers[currentBattleQuestion]?.answerIndex === index) ||
                      (multiplayerMode === 'local' && currentPlayer === 'p2' && player2Answers[currentBattleQuestion]?.answerIndex === index) ||
                      (multiplayerMode !== 'local' && playerAnswers[currentBattleQuestion]?.answerIndex === index)
                    ) {
                      optionClass = 'bg-red-600 border-red-700 text-white';
                    } else {
                      optionClass = darkMode 
                        ? 'bg-slate-800 border-purple-500/30 text-white opacity-60' 
                        : 'bg-white border-purple-300 text-gray-900 opacity-60';
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleBattleAnswer(index)}
                      disabled={showAnswer || 
                        (multiplayerMode === 'local' && (
                          (currentPlayer === 'p1' && player1Answers[currentBattleQuestion]) ||
                          (currentPlayer === 'p2' && player2Answers[currentBattleQuestion])
                        )) ||
                        (multiplayerMode !== 'local' && playerAnswers[currentBattleQuestion])
                      }
                      className={`px-5 py-4 text-left border rounded-xl font-medium transition-all text-lg ${optionClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showAnswer && isCorrect && (
                          <span className="text-white text-lg">✓</span>
                        )}
                        {showAnswer && 
                          ((multiplayerMode === 'local' && currentPlayer === 'p1' && player1Answers[currentBattleQuestion]?.answerIndex === index && !isCorrect) ||
                          (multiplayerMode === 'local' && currentPlayer === 'p2' && player2Answers[currentBattleQuestion]?.answerIndex === index && !isCorrect) ||
                          (multiplayerMode !== 'local' && playerAnswers[currentBattleQuestion]?.answerIndex === index && !isCorrect)) ? (
                          <span className="text-white text-lg">✗</span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* 👆 DITO TAPOS NA YUNG UPDATED QUESTION OPTIONS GRID 👆 */}

              {/* Action Buttons - UPDATED FOR LOCAL MULTIPLAYER */}
              {multiplayerMode === 'local' && showAnswer ? (
                <div className="space-y-3 mt-6">
                  {/* Show who answered what */}
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} text-center`}>
                    <p className={`font-bold ${textClass} mb-2`}>Answers Submitted:</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-100'}`}>
                        <p className="text-green-400 font-semibold">{currentUser.name}:</p>
                        <p className={textSecondary}>
                          {player1Answers[currentBattleQuestion] ? 
                            (player1Answers[currentBattleQuestion].isCorrect ? '✅ Correct' : '❌ Wrong') : 
                            '⏳ Waiting...'}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
                        <p className="text-blue-400 font-semibold">{player2Name}:</p>
                        <p className={textSecondary}>
                          {player2Answers[currentBattleQuestion] ? 
                            (player2Answers[currentBattleQuestion].isCorrect ? '✅ Correct' : '❌ Wrong') : 
                            '⏳ Waiting...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={nextPlayerOrQuestion}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    {currentPlayer === 'p1' ? `Pass to ${player2Name} →` : 
                    currentBattleQuestion < battleQuestions.length - 1 ? 'Next Question →' : 'View Results →'}
                  </button>
                </div>
              ) : multiplayerMode !== 'local' && playerAnswers[currentBattleQuestion] ? (
                <button
                  onClick={nextBattleQuestion}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  {currentBattleQuestion < battleQuestions.length - 1 ? 'Next Question →' : 'View Results →'}
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* Results Step */}
        {battleStep === 'results' && showBattleResults && (
          <BattleResults
            playerScore={multiplayerMode === 'local' ? player1Score : playerScore}
            opponentScore={multiplayerMode === 'local' ? player2Score : opponentScore}
            playerName={currentUser.name}
            opponentName={multiplayerMode === 'local' ? player2Name : opponentName}
            playerTimes={playerTimes}
            playerAnswers={playerAnswers}
            player1Score={player1Score}
            player2Score={player2Score}
            player1Answers={player1Answers}
            player2Answers={player2Answers}
            onRematch={() => {
              // Reset local multiplayer states
              if (multiplayerMode === 'local') {
                setPlayer1Score(0);
                setPlayer2Score(0);
                setPlayer1Answers([]);
                setPlayer2Answers([]);
                setCurrentPlayer('p1');
                setShowAnswer(false);
              }
              restartBattle();
            }}
            onExit={() => {
              setScreen('topics');
            }}
            darkMode={darkMode}
            multiplayerMode={multiplayerMode}
            battleConfig={battleConfig}
          />
        )}
      </div>
    </div>
  );
}

    if (screen === 'quiz') {
      const questions = getFilteredQuestions(selectedTopic.id);
      const currentQ = questions[currentQuestion];
      const progress = Math.round((currentQuestion / questions.length) * 100);
      
      return (
        <div className={`min-h-screen ${bgClass} p-6`}>
          <div className="max-w-3xl mx-auto">
            {/* Progress Header */}
            <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${textClass} flex items-center gap-2`}>
                  {selectedTopic.icon} {selectedTopic.name}
                </h3>
                <span className={`text-lg font-bold ${textClass}`}>{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center mb-6 gap-3">
              <div className={`p-3 rounded-xl flex items-center gap-2 ${darkMode ? 'bg-slate-800' : 'bg-gray-200'} ${activePowerUp === 'timeFreeze' ? 'ring-4 ring-cyan-400' : ''}`}>
                <Clock size={20} className={activePowerUp === 'timeFreeze' ? 'text-cyan-400' : textSecondary} />
                <span className={`font-mono text-xl ${textClass}`}>{timeLeft}s</span>
              </div>
              <div className={`text-3xl font-extrabold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {score}
              </div>
              <div className={`p-3 rounded-xl flex items-center gap-2 ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
                <Zap size={20} className={textSecondary} />
                <span className={`font-semibold text-xl ${textClass}`}>{streak}</span>
              </div>
            </div>

            {/* Question Card */}
            <div className={`${cardClass} rounded-2xl p-8 border mb-6`}>
              <h4 className={`text-2xl font-semibold ${textClass} mb-6`}>
                {currentQ.q}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {currentQ.options.map((option, index) => {
                  const isRemoved = removedOptions.includes(index);
                  const isCurrentSelected = selectedAnswer === index;
                  let optionClass = darkMode ? 'bg-slate-800 border-purple-500/30 text-white hover:bg-purple-700' : 'bg-white border-purple-300 text-gray-900 hover:bg-purple-100';
                  
                  if (answered) {
                    if (index === currentQ.correct) {
                      optionClass = 'bg-green-600 border-green-700 text-white pointer-events-none';
                    } else if (isCurrentSelected) {
                      optionClass = 'bg-red-600 border-red-700 text-white pointer-events-none';
                    } else if (isRemoved) {
                      optionClass = 'bg-gray-700/50 border-gray-600 line-through text-gray-400 opacity-50 pointer-events-none';
                    } else {
                      optionClass = darkMode ? 'bg-slate-800 border-purple-500/30 text-white opacity-60 pointer-events-none' : 'bg-white border-purple-300 text-gray-900 opacity-60 pointer-events-none';
                    }
                  } else if (isRemoved) {
                    optionClass = 'bg-gray-700/50 border-gray-600 line-through text-gray-400 opacity-50 pointer-events-none';
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={answered || isRemoved}
                      className={`px-5 py-4 text-left border rounded-xl font-medium transition-all text-lg ${optionClass}`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {/* ✅ DITO MO ILALAGAY ANG UPDATED ANSWERED SECTION */}
              {answered && (
                <div className="mt-6 space-y-3">
                  {/* See Solution Button */}
                  <button 
                    onClick={() => setShowSolution(true)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
                  >
                    📚 See Detailed Solution
                  </button>
                  
                  {/* Next Question Button */}
                  <button 
                    onClick={nextQuestion}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'} 
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Power-ups */}
            <div className={`${cardClass} rounded-2xl p-4 border`}>
              <h4 className={`text-lg font-bold ${textClass} mb-3`}>Power-Ups</h4>
              <div className="flex justify-around gap-4">
                <PowerUpButton
                  type="timeFreeze"
                  icon={<Clock size={20} />}
                  count={powerUps.timeFreeze}
                  onClick={usePowerUp}
                  active={activePowerUp === 'timeFreeze'}
                  darkMode={darkMode}
                  answered={answered}
                />
                <PowerUpButton
                  type="fiftyFifty"
                  icon={<ShieldHalf size={20} />}
                  count={powerUps.fiftyFifty}
                  onClick={usePowerUp}
                  active={false}
                  darkMode={darkMode}
                  answered={answered}
                />
                <PowerUpButton
                  type="doublePoints"
                  icon={<Award size={20} />}
                  count={powerUps.doublePoints}
                  onClick={usePowerUp}
                  active={activePowerUp === 'doublePoints'}
                  darkMode={darkMode}
                  answered={answered}
                />
              </div>
            </div>

            {/* ✅ DAGDAG ITO - SOLUTION MODAL */}
            <SolutionModal 
              question={currentQ}
              isOpen={showSolution}
              onClose={() => setShowSolution(false)}
              darkMode={darkMode}
            />
          </div>
        </div>
      );
    }

  if (screen === 'results') {
    const quizResult = currentUser.history[currentUser.history.length - 1];
    const currentRank = getRank(currentUser.totalPoints);
    
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
        <div className={`max-w-xl w-full ${cardClass} rounded-3xl p-8 border shadow-2xl text-center`}>
          <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Quiz Complete!</h1>
          <p className={textSecondary}>Topic: {quizResult.topic} ({quizResult.difficulty.toUpperCase()})</p>
          
          <div className="my-8">
            <div className="text-6xl font-extrabold text-green-400">{quizResult.score}</div>
            <p className={textClass}>Points Earned</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-gray-100'} p-4 rounded-xl`}>
              <p className={textSecondary}>Accuracy</p>
              <p className={`text-3xl font-bold ${textClass}`}>{quizResult.accuracy}%</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-gray-100'} p-4 rounded-xl`}>
              <p className={textSecondary}>Total Points</p>
              <p className={`text-3xl font-bold ${textClass}`}>{currentUser.totalPoints}</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-gray-100'} p-4 rounded-xl col-span-2`}>
              <p className={textSecondary}>Max Streak</p>
              <p className={`text-3xl font-bold ${textClass}`}>{maxStreak}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className={textSecondary}>Your Rank</p>
            <h3 className={`text-3xl font-bold ${currentRank.color} flex items-center justify-center gap-2`}>
              {currentRank.icon} {currentRank.title}
            </h3>
          </div>
          
          <button onClick={() => setScreen('topics')} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'leaderboard') {
  const currentLeaderboard = leaderboardType === 'training' ? leaderboard : battleLeaderboard;
  const title = leaderboardType === 'training' ? 'Training Ground Leaderboard' : 'Battle Arena Leaderboard';
  const icon = leaderboardType === 'training' ? '🎯' : '⚔️';

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-3xl mx-auto">
        <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-3xl font-bold ${textClass} flex items-center gap-3`}>
              <Trophy className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
              {title}
            </h2>
            <button onClick={() => setScreen('topics')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all text-white">
              Back
            </button>
          </div>
          
          {/* Leaderboard Type Selector */}
          <div className="flex justify-center mb-4">
            <LeaderboardSelector 
              currentType={leaderboardType}
              onTypeChange={setLeaderboardType}
              darkMode={darkMode}
            />
          </div>

          {/* Stats Summary */}
          <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{currentLeaderboard.length}</div>
                <div className={textSecondary}>Players</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {currentLeaderboard[0]?.totalPoints || 0}
                </div>
                <div className={textSecondary}>Top Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(currentLeaderboard.reduce((sum, player) => sum + (player.totalPoints || 0), 0) / Math.max(currentLeaderboard.length, 1))}
                </div>
                <div className={textSecondary}>Average</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className={`${cardClass} rounded-2xl p-4 border`}>
          <table className="w-full text-left table-auto">
            <thead className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              <tr>
                <th className="py-2 px-4">Rank</th>
                <th className="py-2 px-4">Player</th>
                <th className="py-2 px-4 text-right">
                  {leaderboardType === 'training' ? 'Points' : 'Battle Rating'}
                </th>
                {leaderboardType === 'battle' && (
                  <th className="py-2 px-4 text-right">W/L</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentLeaderboard.map((player, index) => {
                const rank = getRank(player.totalPoints);
                const isCurrentUser = player.name === currentUser.name;
                const battleStats = leaderboardType === 'battle' ? player.battleStats || { wins: 0, losses: 0 } : null;
                
                return (
                  <tr key={index} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t ${isCurrentUser ? 'bg-purple-900/50' : 'hover:bg-slate-800/50'}`}>
                    <td className={`py-3 px-4 ${textClass} font-semibold`}>
                      <div className="flex items-center gap-2">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}  
                        {index === 2 && '🥉'}
                        {index > 2 && index + 1}
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${textClass}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{player.avatar}</span>
                        <div>
                          <span className="font-semibold">{player.name} {isCurrentUser && ' (You)'}</span>
                          <p className={`text-xs ${rank.color}`}>
                            {leaderboardType === 'training' ? `${rank.icon} ${rank.title}` : `⚔️ ${getBattleRank(player.totalPoints).title}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${
                      leaderboardType === 'training' 
                        ? (darkMode ? 'text-yellow-300' : 'text-yellow-600')
                        : (darkMode ? 'text-red-300' : 'text-red-600')
                    }`}>
                      {player.totalPoints}
                      {leaderboardType === 'battle' && (
                        <div className="text-xs font-normal text-gray-400">
                          {getBattleRank(player.totalPoints).title}
                        </div>
                      )}
                    </td>
                    {leaderboardType === 'battle' && battleStats && (
                      <td className={`py-3 px-4 text-right ${textSecondary} text-sm`}>
                        {battleStats.wins}W - {battleStats.losses}L
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

  // Sa achievements screen, update ang grid para sa mas maraming achievements
if (screen === 'achievements') {
  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-3xl font-bold ${textClass} flex items-center gap-3`}>
              <Medal className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
              Achievements
              <span className={`text-sm ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white px-3 py-1 rounded-full`}>
                {currentUser.achievements?.length || 0}/{achievements.length}
              </span>
            </h2>
            <button onClick={() => setScreen('topics')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all text-white">
              Back
            </button>
          </div>
        </div>

        {/* ✅ UPDATE: 3 columns for more achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => {
            const unlocked = currentUser.achievements?.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`${cardClass} rounded-xl p-6 border transition-all duration-300 ${
                  unlocked 
                    ? 'border-yellow-500 transform hover:scale-105' 
                    : 'opacity-70 grayscale'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-4xl ${unlocked ? 'animate-bounce' : ''}`}>
                    {ach.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${textClass} mb-1`}>{ach.name}</h3>
                    <p className={`${textSecondary} text-sm mb-2`}>{ach.desc}</p>
                    {unlocked ? (
                      <span className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
                        ✓ Unlocked!
                      </span>
                    ) : (
                      <span className={`${textSecondary} text-xs flex items-center gap-1`}>
                        🔒 Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
  
 if (screen === 'study') {
  const guide = studyGuides[selectedTopic?.id];

  if (!selectedTopic) {
    // Topic selection for study
    return (
      <div className={`min-h-screen ${bgClass} p-6`}>
        <div className="max-w-6xl mx-auto">
          <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${textClass} flex items-center gap-3`}>
                <Brain className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                Study Center
              </h2>
              <button onClick={() => setScreen('topics')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all text-white">
                Back
              </button>
            </div>
            <p className={`${textSecondary} mt-2`}>Master the fundamentals before taking the quiz!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic);
                  setScreen('study');
                }}
                className={`${cardClass} rounded-2xl p-6 border hover:border-purple-500 transition-all text-left hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">{topic.icon}</span>
                  <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${topic.color} text-white text-xs font-semibold`}>
                    Study Guide
                  </div>
                </div>
                <h4 className={`text-xl font-bold ${textClass} mb-2`}>{topic.name}</h4>
                <p className={`${textSecondary} text-sm`}>{topic.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

// Individual study guide view
  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{guide.icon}</span>
              <div>
                <h2 className={`text-3xl font-bold ${textClass}`}>{guide.title}</h2>
                <p className={textSecondary}>Complete reference guide</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedTopic(null);
                setScreen('study');
              }} 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all text-white"
            >
              Back to Topics
            </button>
          </div>
        </div>

        {/* Study Sections */}
        {guide.sections.map((section, idx) => (
          <div key={idx} className={`${cardClass} rounded-2xl p-6 mb-6 border`}>
            <h3 className={`text-2xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
              {section.title === "Key Definitions" && "📖"}
              {section.title === "Essential Formulas with Detailed Explanations" && "🧮"}
              {section.title === "Visual Concepts" && "🎨"}
              {section.title}
            </h3>

            {/* Key Definitions */}
            {section.content && section.title === "Key Definitions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.content.map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                    <h4 className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} mb-2`}>
                      {item.term}
                    </h4>
                    <p className={`${textSecondary} text-sm`}>{item.def}</p>
                  </div>
                ))}
              </div>
            )}

            {/* EXPANDABLE FORMULAS - CLICKABLE! */}
            {section.expandableLaws && (
              <div className="space-y-3">
                {section.expandableLaws.map((law, i) => (
                  <div key={law.id} className={`rounded-xl overflow-hidden border ${darkMode ? 'border-purple-500/30' : 'border-purple-300'} transition-all`}>
                    {/* Clickable Header */}
                    <button
                      onClick={() => setExpandedLaw(expandedLaw === law.id ? null : law.id)}
                      className={`w-full p-4 flex items-center justify-between ${darkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <span className={`text-2xl ${expandedLaw === law.id ? 'rotate-90' : ''} transition-transform`}>
                          ▶
                        </span>
                        <div>
                          <h4 className={`text-lg font-bold ${textClass}`}>{law.title}</h4>
                          <p className={`font-mono text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>{law.formula}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${expandedLaw === law.id ? 'bg-green-500 text-white' : darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                        {expandedLaw === law.id ? 'Collapse' : 'Expand'}
                      </span>
                    </button>

                    {/* Expanded Content */}
                    {expandedLaw === law.id && (
                      <div className={`p-6 ${darkMode ? 'bg-slate-900/30' : 'bg-white'} space-y-6 animate-fadeIn`}>
                        {/* Definition */}
                        <div>
                          <h5 className={`text-lg font-bold ${textClass} mb-2 flex items-center gap-2`}>
                            📖 Definition
                          </h5>
                          <p className={`${textSecondary} text-sm`}>{law.definition}</p>
                        </div>

                        {/* Real Life Examples */}
                        <div>
                          <h5 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                            🌍 Real Life Examples
                          </h5>
                          <div className="space-y-2">
                            {law.realLife.map((example, j) => (
                              <div key={j} className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                <span className="text-green-500 font-bold text-lg">•</span>
                                <p className={`${textSecondary} text-sm flex-1`}>{example}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Visual Representation */}
                        <div>
                          <h5 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                            📊 Visual Representation
                          </h5>
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'} overflow-x-auto  ${textClass}`}>
                            {law.visual}
                          </div>
                        </div>

                        {/* Formula with Symbols */}
                        <div>
                          <h5 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                            🧮 Formula Breakdown
                          </h5>
                          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-r from-purple-100 to-pink-100'} mb-4`}>
                            <div className={`text-3xl font-bold font-mono text-center ${darkMode ? 'text-purple-300' : 'text-purple-700'} mb-4`}>
                              {law.formula}
                            </div>
                            <div className="text-center">
                              <span className={`${textSecondary} text-sm`}>where:</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {law.symbols.map((sym, j) => (
                              <div key={j} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                <span className={`font-mono font-bold text-xl ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  {sym.symbol}
                                </span>
                                <span className={`${textSecondary} text-sm`}>=</span>
                                <span className={`${textSecondary} text-sm flex-1`}>{sym.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sample Problem */}
                        <div>
                          <h5 className={`text-lg font-bold ${textClass} mb-3 flex items-center gap-2`}>
                            📝 Sample Problem
                          </h5>
                          
                          {/* Problem Statement */}
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-300'} mb-3`}>
                            <p className={`${textClass} font-semibold mb-2 flex items-center gap-2`}>
                              ❓ Problem:
                            </p>
                            <p className={textSecondary}>{law.sampleProblem.question}</p>
                          </div>

                          {/* Given */}
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-300'} mb-3`}>
                            <p className={`${textClass} font-semibold mb-2 flex items-center gap-2`}>
                              📋 Given:
                            </p>
                            <div className="space-y-1">
                              {law.sampleProblem.given.map((item, j) => (
                                <p key={j} className={`${textSecondary} font-mono text-sm flex items-start gap-2`}>
                                  <span className="text-purple-400">•</span>
                                  <span>{item}</span>
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Unknown */}
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-300'} mb-3`}>
                            <p className={`${textClass} font-semibold mb-2 flex items-center gap-2`}>
                              🔍 Unknown:
                            </p>
                            <div className="space-y-1">
                              {law.sampleProblem.unknown.map((item, j) => (
                                <p key={j} className={`${textSecondary} font-mono text-sm flex items-start gap-2`}>
                                  <span className="text-orange-400">•</span>
                                  <span>{item}</span>
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Solution */}
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-cyan-900/20 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-300'} mb-3`}>
                            <p className={`${textClass} font-semibold mb-3 flex items-center gap-2`}>
                              🧮 Solution:
                            </p>
                            <div className="space-y-1">
                              {law.sampleProblem.solution.map((line, j) => (
                                <p key={j} className={`${line === '' ? 'h-2' : ''} ${textSecondary} font-mono text-sm ${line.startsWith('Step') ? 'font-bold text-cyan-400 mt-2' : ''}`}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Conclusion */}
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-300'}`}>
                            <p className={`${textClass} font-semibold mb-2 flex items-center gap-2`}>
                              ✅ Conclusion:
                            </p>
                            <p className={`${textSecondary} text-sm leading-relaxed`}>
                              {law.sampleProblem.conclusion}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Visual Concepts Section */}
            {section.diagrams && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.diagrams.map((diagram, i) => (
                  <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                    <h4 className={`font-bold ${textClass} mb-3`}>{diagram.name}</h4>
                    {diagram.svg ? (
                      <div className="my-4 flex items-center justify-center">{diagram.svg}</div>
                    ) : diagram.imageUrl ? (
                      <img src={diagram.imageUrl} alt={diagram.name} className="w-full h-auto rounded-lg"/>
                    ) : (
                      <pre className={`${textSecondary} text-xs font-mono whitespace-pre overflow-x-auto`}>
                        {diagram.visual}
                      </pre>
                    )}
                    {diagram.description && (
                      <p className={`${textSecondary} text-sm mt-3`}>{diagram.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => {
              setScreen('quiz');
              startQuiz(selectedTopic);
            }}
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Take Quiz on {selectedTopic.name} 🎯
          </button>
          <button
            onClick={() => {
              setSelectedTopic(null);
              setScreen('study');
            }}
            className={`px-6 py-4 ${darkMode ? 'bg-slate-800' : 'bg-gray-200'} rounded-xl font-semibold ${textClass} hover:opacity-80 transition-all`}
          >
            Choose Another Topic
          </button>
        </div>
      </div>
    </div>
  );
}

return null;
}

const ProgressDashboard = ({ currentUser, darkMode, topics }) => {
  const cardClass = darkMode 
    ? 'bg-slate-900/80 backdrop-blur-xl border-purple-500/30' 
    : 'bg-white/80 backdrop-blur-xl border-purple-300';
  
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  // Calculate progress from user data
  const calculateProgress = () => {
    const progress = {};
    topics.forEach(topic => {
      const topicScore = currentUser.topicScores?.[topic.id] || 0;
      // Simple progress calculation based on points
      const progressPercent = Math.min(100, (topicScore / 500) * 100);
      progress[topic.id] = Math.round(progressPercent);
    });
    return progress;
  };

  const progressData = calculateProgress();
  
  // Calculate overall stats
  const totalQuizzes = currentUser.gamesPlayed || 0;
  const totalPoints = currentUser.totalPoints || 0;
  const accuracy = currentUser.history?.length > 0 
    ? Math.round(currentUser.history.reduce((acc, quiz) => acc + parseFloat(quiz.accuracy), 0) / currentUser.history.length)
    : 0;

  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <h3 className={`text-2xl font-bold ${textClass} mb-6 flex items-center gap-2`}>
        📊 Learning Analytics
      </h3>
      
      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        {topics.map(topic => {
          const progress = progressData[topic.id] || 0;
          return (
            <div key={topic.id}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{topic.icon}</span>
                  <span className={`font-semibold ${textClass}`}>
                    {topic.name}
                  </span>
                </div>
                <span className={textSecondary}>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    progress >= 80 ? 'bg-green-500' :
                    progress >= 60 ? 'bg-blue-500' :
                    progress >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={textSecondary}>
                  Points: {currentUser.topicScores?.[topic.id] || 0}
                </span>
                <span className={textSecondary}>
                  {progress >= 100 ? 'Mastered! 🎉' : 
                   progress >= 80 ? 'Advanced' :
                   progress >= 60 ? 'Intermediate' :
                   progress >= 40 ? 'Beginner' : 'Newbie'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
        <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <div className="text-2xl font-bold text-green-400">{totalQuizzes}</div>
          <div className={textSecondary}>Quizzes</div>
        </div>
        <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <div className="text-2xl font-bold text-blue-400">{totalPoints}</div>
          <div className={textSecondary}>Points</div>
        </div>
        <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
          <div className={textSecondary}>Accuracy</div>
        </div>
        <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <div className="text-2xl font-bold text-yellow-400">
            {currentUser.achievements?.length || 0}
          </div>
          <div className={textSecondary}>Badges</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mt-6">
        <h4 className={`font-bold ${textClass} mb-3 flex items-center gap-2`}>
          📈 Weekly Activity
        </h4>
        <div className="flex items-end justify-between h-16 gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
            const height = Math.floor(Math.random() * 40) + 10; // Random height for demo
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t ${
                    index === new Date().getDay() - 1 
                      ? 'bg-purple-500' 
                      : 'bg-gray-600'
                  }`}
                  style={{ height: `${height}px` }}
                ></div>
                <span className={`text-xs mt-1 ${textSecondary}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


const SolutionModal = ({ question, isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  const cardClass = darkMode 
    ? 'bg-slate-900/95 backdrop-blur-xl border-purple-500/30' 
    : 'bg-white/95 backdrop-blur-xl border-purple-300';
  
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const solution = question.solution;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`${cardClass} rounded-2xl p-6 border max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-2xl font-bold ${textClass}`}>
            {solution.type === 'problem' ? '📚 Detailed Solution' : '💡 Explanation'}
          </h3>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
          >
            ✕
          </button>
        </div>

        {/* Question */}
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-300'} mb-4`}>
          <p className={`font-semibold ${textClass} mb-2`}>Question:</p>
          <p className={textSecondary}>{question.q}</p>
        </div>

        {/* For PROBLEM type - show full solution */}
        {solution.type === 'problem' && (
          <>
            {/* Given */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-300'} mb-4`}>
              <p className={`font-semibold ${textClass} mb-2`}>📋 Given:</p>
              <div className="space-y-1">
                {solution.given.map((item, index) => (
                  <p key={index} className={`${textSecondary} flex items-start gap-2`}>
                    <span className="text-green-400 mt-1">•</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Unknown */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-300'} mb-4`}>
              <p className={`font-semibold ${textClass} mb-2`}>🔍 Unknown:</p>
              <div className="space-y-1">
                {solution.unknown.map((item, index) => (
                  <p key={index} className={`${textSecondary} flex items-start gap-2`}>
                    <span className="text-orange-400 mt-1">•</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Formula */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-300'} mb-4`}>
              <p className={`font-semibold ${textClass} mb-2`}>🧮 Formula:</p>
              <p className={`font-mono text-lg ${darkMode ? 'text-purple-300' : 'text-purple-600'} font-bold`}>
                {solution.formula}
              </p>
            </div>

            {/* Step-by-Step Solution */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-cyan-900/20 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-300'} mb-4`}>
              <p className={`font-semibold ${textClass} mb-3`}>📝 Step-by-Step Solution:</p>
              <div className="space-y-3">
                {solution.stepByStep.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      darkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <p className={`${textSecondary} flex-1`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-300'} mb-4`}>
              <p className={`font-semibold ${textClass} mb-2`}>✅ Conclusion:</p>
              <p className={textSecondary}>{solution.conclusion}</p>
            </div>
          </>
        )}

        {/* For CONCEPT/DEFINITION type - show explanation only */}
        {(solution.type === 'concept' || solution.type === 'definition') && (
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-indigo-900/20 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-300'} mb-4`}>
            <p className={`font-semibold ${textClass} mb-2`}>
              {solution.type === 'concept' ? '🧠 Conceptual Explanation' : '📖 Definition'}
            </p>
            <p className={textSecondary}>{solution.explanation}</p>
          </div>
        )}

        {/* Explanation (shown for all types) */}
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-300'}`}>
          <p className={`font-semibold ${textClass} mb-2`}>💡 Key Insight:</p>
          <p className={textSecondary}>{solution.explanation}</p>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold text-white transition-all"
        >
          Close Explanation
        </button>
      </div>
    </div>
  );
};

const LeaderboardSelector = ({ currentType, onTypeChange, darkMode }) => {
  return (
    <div className={`flex gap-2 p-1 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
      <button
        onClick={() => onTypeChange('training')}
        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
          currentType === 'training' 
            ? 'bg-purple-600 text-white shadow-lg' 
            : darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-300'
        }`}
      >
        🎯 Training
      </button>
      <button
        onClick={() => onTypeChange('battle')}
        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
          currentType === 'battle' 
            ? 'bg-red-600 text-white shadow-lg' 
            : darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-300'
        }`}
      >
        ⚔️ Battle
      </button>
    </div>
  );
};


const PowerUpButton = ({ type, icon, count, onClick, active, darkMode, answered }) => {
  const isDisabled = count <= 0 || answered;
  const baseClass = darkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700';
  const activeClass = active ? 'ring-4 ring-offset-2 ring-cyan-500/50' : '';
  
  return (
    <button
      onClick={() => onClick(type)}
      disabled={isDisabled}
      className={`flex-1 flex flex-col items-center p-3 rounded-xl border border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${baseClass} ${activeClass}`}
    >
      <div className="relative">
        {icon}
        <span className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center ${count > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {count}
        </span>
      </div>
      <span className="text-xs mt-1 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
    </button>
  );
};


const SpinWheel = ({ topics, onTopicSelected, darkMode, isSpinning }) => {
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  
  // Select 4 random topics for the wheel
  const wheelTopics = [...topics].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  return (
    <div className={`rounded-2xl p-8 border text-center ${
      darkMode ? 'bg-slate-900/80 border-purple-500/30' : 'bg-white/80 border-purple-300'
    }`}>
      <h3 className={`text-2xl font-bold ${textClass} mb-6`}>Topic Wheel</h3>
      
      {/* Wheel Container */}
      <div className="relative w-64 h-64 mx-auto mb-6">
        {/* Wheel */}
        <div className={`w-full h-full rounded-full border-4 ${
          darkMode ? 'border-purple-500' : 'border-purple-400'
        } relative overflow-hidden ${
          isSpinning ? 'animate-spin' : ''
        }`} style={{ animationDuration: '2s' }}>
          
          {/* Wheel Segments */}
          {wheelTopics.map((topic, index) => (
            <div
              key={topic.id}
              className={`absolute w-1/2 h-1/2 origin-bottom-right ${
                index === 0 ? 'bg-red-500/30' :
                index === 1 ? 'bg-blue-500/30' :
                index === 2 ? 'bg-green-500/30' :
                'bg-yellow-500/30'
              }`}
              style={{
                transform: `rotate(${index * 90}deg)`,
                clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)'
              }}
            >
              <div
                className="absolute top-4 left-4 transform -rotate-45"
                style={{ transformOrigin: 'center' }}
              >
                <span className="text-2xl">{topic.icon}</span>
              </div>
            </div>
          ))}
          
          {/* Center Circle */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${
            darkMode ? 'bg-purple-600' : 'bg-purple-400'
          } border-2 ${darkMode ? 'border-purple-400' : 'border-purple-300'}`}></div>
        </div>
        
        {/* Pointer */}
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-0 h-0 
          border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 ${
          darkMode ? 'border-t-red-500' : 'border-t-red-400'
        }`}></div>
      </div>

      {/* Topic Labels */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {wheelTopics.map((topic, index) => (
          <div
            key={topic.id}
            className={`p-3 rounded-lg flex items-center gap-2 ${
              index === 0 ? 'bg-red-500/20' :
              index === 1 ? 'bg-blue-500/20' :
              index === 2 ? 'bg-green-500/20' :
              'bg-yellow-500/20'
            }`}
          >
            <span className="text-xl">{topic.icon}</span>
            <span className={`text-sm font-medium ${textClass}`}>{topic.name}</span>
          </div>
        ))}
      </div>

      {/* Spinning Status */}
      <div className="mt-6">
        {isSpinning ? (
          <div className="space-y-2">
            <div className="text-2xl animate-pulse">🎡</div>
            <p className={`font-semibold ${textClass}`}>Spinning...</p>
            <p className={textSecondary}>Randomizing your battle topic!</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className={`font-semibold ${textClass}`}>Ready to Spin!</p>
            <p className={textSecondary}>Click spin to randomize your battle topic</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ FIXED: Enhanced BattleResults component with proper achievement checking
  const BattleResults = ({ 
    playerScore, 
    opponentScore, 
    playerName, 
    opponentName, 
    playerTimes = [], 
    playerAnswers = [],
    onRematch, 
    onExit,
    darkMode,
    battleConfig,
    multiplayerMode = 'none'
  }) => {
    const cardClass = darkMode 
      ? 'bg-slate-900/80 backdrop-blur-xl border-purple-500/30' 
      : 'bg-white/80 backdrop-blur-xl border-purple-300';
    const textClass = darkMode ? 'text-white' : 'text-gray-900';
    const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

    const winner = playerScore > opponentScore ? playerName : 
                  opponentScore > playerScore ? opponentName : 
                  'Draw';
    
    const totalQuestions = battleConfig?.questionCount || playerAnswers.length;
    const correctAnswers = playerAnswers.filter(a => a?.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const avgTime = playerTimes.length > 0 ? (playerTimes.reduce((a, b) => a + b, 0) / playerTimes.length).toFixed(1) : '0.0';
    const fastestTime = playerTimes.length > 0 ? Math.min(...playerTimes).toFixed(1) : '0.0';

    // ✅ FIXED: Check for perfect battle and comeback
    const wasPerfect = accuracy === 100;
    const wasComeback = playerScore > opponentScore && playerScore - opponentScore <= 50; // Close game comeback

    // ✅ FIXED: Update achievements when results are shown
    useEffect(() => {
      const updateAchievements = async () => {
        try {
          const userData = await storage.get(`player:${playerName}`);
          if (userData) {
            const user = JSON.parse(userData.value);
            const battleResult = {
              won: winner === playerName,
              wasPerfect,
              wasComeback
            };
            
            const newAchievements = checkAchievements(user, battleResult, 0, 0);
            
            if (newAchievements.length > 0) {
              // Update user achievements
              user.achievements = [...(user.achievements || []), ...newAchievements];
              await storage.set(`player:${playerName}`, JSON.stringify(user));
              
              // Show achievement notifications
              newAchievements.forEach(achId => {
                const achievement = achievements.find(a => a.id === achId);
                if (achievement) {
                  console.log(`🎉 Achievement Unlocked: ${achievement.name}`);
                  // You can add a toast notification here
                }
              });
            }
          }
        } catch (error) {
          console.log('Error updating achievements:', error);
        }
      };

      updateAchievements();
    }, [playerName, winner, wasPerfect, wasComeback]);

    return (
      <div className={`${cardClass} rounded-2xl p-8 border text-center`}>
        <h3 className={`text-3xl font-bold ${textClass} mb-6`}>Battle Results</h3>
        
        {/* Scores Comparison */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Player Results */}
          <div className={`p-6 rounded-xl ${
            playerScore >= opponentScore 
              ? 'bg-green-900/20 border border-green-500/30' 
              : 'bg-slate-800/50'
          }`}>
            <h4 className={`text-xl font-bold ${textClass} mb-2`}>{playerName}</h4>
            <div className="text-4xl font-bold text-green-400 mb-2">{playerScore}</div>
            <p className={textSecondary}>Total Points</p>
            <div className="mt-2 space-y-1 text-xs">
              <p className={textSecondary}>Accuracy: {accuracy}%</p>
              <p className={textSecondary}>Correct: {correctAnswers}/{totalQuestions}</p>
              <p className={textSecondary}>Avg Time: {avgTime}s</p>
              <p className={textSecondary}>Fastest: {fastestTime}s</p>
              {wasPerfect && (
                <p className="text-yellow-400 font-bold">✨ Perfect Battle!</p>
              )}
            </div>
          </div>

          {/* Opponent Results */}
          <div className={`p-6 rounded-xl ${
            opponentScore >= playerScore 
              ? 'bg-green-900/20 border border-green-500/30' 
              : 'bg-slate-800/50'
          }`}>
            <h4 className={`text-xl font-bold ${textClass} mb-2`}>{opponentName}</h4>
            <div className="text-4xl font-bold text-red-400 mb-2">{opponentScore}</div>
            <p className={textSecondary}>Total Points</p>
            {multiplayerMode === 'none' && (
              <p className="text-xs text-gray-500 mt-2">🤖 AI Opponent</p>
            )}
          </div>
        </div>

        {/* Winner Announcement */}
        <div className={`p-6 rounded-xl mb-6 ${
          playerScore > opponentScore 
            ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30'
            : playerScore < opponentScore
            ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30'
            : 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30'
        }`}>
          <h4 className={`text-2xl font-bold ${
            playerScore > opponentScore ? 'text-green-400' :
            playerScore < opponentScore ? 'text-red-400' : 'text-purple-400'
          }`}>
            {playerScore > opponentScore ? '🎉 VICTORY! You Win!' :
             playerScore < opponentScore ? '💀 DEFEAT! You Lose!' :
             '⚔️ DRAW! Well fought!'}
          </h4>
          <p className={`mt-2 ${textSecondary}`}>
            {winner === playerName ? 'Congratulations! Your physics knowledge dominated!' : 
             winner === opponentName ? 'Better luck next time! Study more and try again!' : 
             'Incredible battle! You were equally matched!'}
          </p>
          
          {/* Battle Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="text-blue-400">Topic</p>
              <p className={textClass}>{battleConfig?.topics?.[0] || 'Mixed'}</p>
            </div>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <p className="text-purple-400">Difficulty</p>
              <p className={textClass}>{battleConfig?.difficulty || 'Mixed'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onRematch}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            ⚔️ Rematch
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl font-semibold text-white transition-all"
          >
            Exit Battle
          </button>
        </div>
      </div>
    );
  };



export default App;
