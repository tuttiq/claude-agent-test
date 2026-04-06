/* ============================================
   Life Dashboard - App Logic
   ============================================ */

// ---- State Management ----
const STORAGE_KEYS = {
  projectData: 'dashboard_projectData',
  habits: 'dashboard_habits',
  habitChecks: 'dashboard_habitChecks',
  weekOffset: 'dashboard_weekOffset'
};

const CATEGORY_COLORS = {
  health: '#D97706',
  meals: '#059669',
  soyjoy: '#DB2777',
  garden: '#0D9488',
  general: '#7C3AED'
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_NAMES_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function loadState(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function saveState(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

let currentWeekOffset = loadState(STORAGE_KEYS.weekOffset, 0);
let projectData = loadState(STORAGE_KEYS.projectData, { health: null, meals: null, soyjoy: null, garden: null });
let habits = loadState(STORAGE_KEYS.habits, null);
let habitChecks = loadState(STORAGE_KEYS.habitChecks, {});

// Default habits
if (!habits) {
  habits = [
    { id: 'h1', name: 'Morning supplements', category: 'health' },
    { id: 'h2', name: 'Log meals in tracker', category: 'meals' },
    { id: 'h3', name: '30 min workout', category: 'health' },
    { id: 'h4', name: '8+ glasses of water', category: 'health' },
    { id: 'h5', name: 'Meal prep completed', category: 'meals' },
    { id: 'h6', name: 'Garden check-in', category: 'garden' },
    { id: 'h7', name: '8 hrs sleep', category: 'health' }
  ];
  saveState(STORAGE_KEYS.habits, habits);
}

function persist() {
  saveState(STORAGE_KEYS.projectData, projectData);
  saveState(STORAGE_KEYS.habits, habits);
  saveState(STORAGE_KEYS.habitChecks, habitChecks);
  saveState(STORAGE_KEYS.weekOffset, currentWeekOffset);
}

// ---- Date Utilities ----
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getWeekDates(offset) {
  const today = new Date();
  const monday = getMonday(today);
  monday.setDate(monday.getDate() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDateShort(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateISO(d) {
  return d.toISOString().split('T')[0];
}

function isToday(d) {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

function getDayOfWeekIndex(d) {
  const day = d.getDay();
  return day === 0 ? 6 : day - 1; // Mon=0, Sun=6
}

function getTodayDayName() {
  return DAY_NAMES[getDayOfWeekIndex(new Date())];
}

// ---- Sample Data ----
const SAMPLE_DATA = {
  health: {
    dailyCalorieTarget: 2100,
    dailyProteinTarget: 130,
    weeklyWorkoutPlan: [
      { day: "Monday", type: "Upper Body Strength", duration: "45 min", notes: "Bench press, rows, OHP" },
      { day: "Tuesday", type: "Rest / Light Walk", duration: "30 min", notes: "Recovery day - heavy cooking day" },
      { day: "Wednesday", type: "Lower Body Strength", duration: "45 min", notes: "Squats, deadlifts, lunges" },
      { day: "Thursday", type: "HIIT Cardio", duration: "30 min", notes: "Intervals on bike or running" },
      { day: "Friday", type: "Full Body Circuit", duration: "40 min", notes: "Lighter weights, higher reps" },
      { day: "Saturday", type: "Yoga / Mobility", duration: "45 min", notes: "Active recovery" },
      { day: "Sunday", type: "Rest", duration: "0 min", notes: "Full rest day" }
    ],
    supplements: ["Vitamin D3 (5000 IU)", "Omega-3 Fish Oil", "Magnesium Glycinate", "Iron Bisglycinate", "B12 Methylcobalamin", "Probiotics"],
    recentMetrics: { avgRestingHR: 62, avgSleep: "7.2 hrs", avgSteps: 8400, weight: "135 lbs", lastLabDate: "2026-03-15" },
    nutrientFocus: ["Iron", "Vitamin D", "B12", "Magnesium"]
  },
  meals: {
    weeklyMealPlan: [
      { day: "Monday", breakfast: "Overnight oats with berries & chia", lunch: "Kale Caesar salad with chickpeas", dinner: "Lemon herb grilled chicken with roasted vegetables", snacks: "Apple with almond butter", calories: 2050 },
      { day: "Tuesday", breakfast: "Veggie scramble with whole wheat toast", lunch: "Leftover chicken grain bowl", dinner: "Black bean & sweet potato tacos (cook day)", snacks: "Trail mix, yogurt", calories: 2120 },
      { day: "Wednesday", breakfast: "Smoothie (spinach, banana, protein)", lunch: "Taco leftovers burrito bowl", dinner: "Miso glazed salmon with bok choy & rice", snacks: "Hummus & veggies", calories: 2080 },
      { day: "Thursday", breakfast: "Greek yogurt parfait with granola", lunch: "Salmon rice bowl with pickled veggies", dinner: "Pasta primavera with garden vegetables", snacks: "Protein bar", calories: 2100 },
      { day: "Friday", breakfast: "Avocado toast with poached eggs", lunch: "Pasta primavera leftovers", dinner: "Homemade pizza with garden basil & veggies", snacks: "Edamame", calories: 2150 },
      { day: "Saturday", breakfast: "Okara breakfast sausages (SoyJoy test) with eggs", lunch: "Garden salad with grilled tofu", dinner: "Thai coconut curry with garden herbs", snacks: "Fruit & nuts", calories: 2050 },
      { day: "Sunday", breakfast: "Pancakes with fresh garden berries", lunch: "Curry leftovers", dinner: "Meal prep: batch cooking for the week", snacks: "Smoothie", calories: 1950 }
    ],
    dietaryRestrictions: ["Husband: no shellfish", "Low processed sugar", "High iron foods preferred"],
    pantryHighlights: ["Brown rice", "Quinoa", "Canned chickpeas", "Coconut milk", "Various dried spices"],
    seasonalIngredients: ["Kale", "Chard", "Snap peas", "Strawberries", "Artichokes"]
  },
  garden: {
    crops: [
      { name: "Kale (Lacinato)", status: "Producing", bed: "Bed A", plantedDate: "2026-01-15" },
      { name: "Swiss Chard", status: "Producing", bed: "Bed A", plantedDate: "2026-01-20" },
      { name: "Snap Peas", status: "Flowering", bed: "Bed B", plantedDate: "2026-02-01" },
      { name: "Tomatoes (Cherokee Purple)", status: "Seedling", bed: "Bed C", plantedDate: "2026-03-10" },
      { name: "Basil (Genovese)", status: "Growing", bed: "Bed C", plantedDate: "2026-03-01" },
      { name: "Strawberries", status: "Fruiting", bed: "Bed D", plantedDate: "2025-10-15" },
      { name: "Lettuce Mix", status: "Ready to harvest", bed: "Bed A", plantedDate: "2026-02-20" },
      { name: "Zucchini", status: "Seedling", bed: "Bed B", plantedDate: "2026-03-15" }
    ],
    harvestSchedule: [
      { crop: "Kale", readiness: "ready", estimatedDate: "Ongoing", notes: "Harvest outer leaves weekly" },
      { crop: "Swiss Chard", readiness: "ready", estimatedDate: "Ongoing", notes: "Cut-and-come-again" },
      { crop: "Lettuce Mix", readiness: "ready", estimatedDate: "This week", notes: "Harvest before bolting" },
      { crop: "Strawberries", readiness: "soon", estimatedDate: "1-2 weeks", notes: "First fruits appearing" },
      { crop: "Snap Peas", readiness: "soon", estimatedDate: "2-3 weeks", notes: "Pods forming" },
      { crop: "Basil", readiness: "later", estimatedDate: "3-4 weeks", notes: "Pinch flowers to encourage growth" },
      { crop: "Tomatoes", readiness: "later", estimatedDate: "8-10 weeks", notes: "Support with cages soon" },
      { crop: "Zucchini", readiness: "later", estimatedDate: "6-8 weeks", notes: "Watch for squash bugs" }
    ],
    weeklyTasks: [
      "Harvest kale, chard, and lettuce",
      "Water deeply (2x this week - warm forecast)",
      "Pinch basil flowers",
      "Check tomato seedlings for transplant readiness",
      "Add mulch around strawberry plants",
      "Scout for aphids on snap peas"
    ],
    notes: "Warm week ahead (75-82F). Good time to direct-sow beans and cucumbers. Consider shade cloth for lettuce if temps stay high."
  },
  soyjoy: {
    experiments: [
      { name: "Okara Breakfast Sausages v3", status: "active", startDate: "2026-03-28", notes: "Testing new spice blend with smoked paprika. v2 was too dry - adding more moisture.", feedToMealPlan: true, mealPlanDay: "Saturday" },
      { name: "Silken Tofu Chocolate Mousse", status: "active", startDate: "2026-04-01", notes: "Refined sugar-free version with dates and cacao. Testing shelf stability.", feedToMealPlan: false },
      { name: "Edamame Hummus Spread", status: "planned", startDate: "2026-04-12", notes: "High protein alternative to traditional hummus. Competitor: Ithaca Hummus.", feedToMealPlan: true, mealPlanDay: "Wednesday" },
      { name: "Soy Milk Yogurt Culture Test", status: "planned", startDate: "2026-04-20", notes: "Testing different probiotic strains for texture and tang.", feedToMealPlan: false }
    ],
    productLine: [
      { product: "SoyJoy Breakfast Sausages", stage: "Recipe Testing", targetLaunch: "Q3 2026" },
      { product: "SoyJoy Chocolate Mousse", stage: "Early R&D", targetLaunch: "Q4 2026" },
      { product: "SoyJoy Protein Spread", stage: "Concept", targetLaunch: "2027" }
    ]
  }
};

// ---- Navigation ----
const VIEW_TITLES = {
  'dashboard': ['Dashboard', 'Your life at a glance'],
  'weekly-planner': ['Weekly Planner', 'Plan your week'],
  'habits': ['Daily Habits', 'Track your daily routines'],
  'health': ['Health & Fitness', 'Workouts, metrics & supplements'],
  'meals': ['Meal Plan & Recipes', 'Weekly meals & nutrition'],
  'soyjoy': ['SoyJoy Lab', 'Food product experiments'],
  'garden': ['Sunnyvale Garden', 'Crops, harvests & garden tasks'],
  'sync': ['Data Sync & Import', 'Connect your Claude projects']
};

function switchView(viewName) {
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const panel = document.getElementById('view-' + viewName);
  if (panel) panel.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (navItem) navItem.classList.add('active');

  const [title, subtitle] = VIEW_TITLES[viewName] || ['Dashboard', ''];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = subtitle;

  renderCurrentView(viewName);
}

function renderCurrentView(viewName) {
  updateWeekLabel();
  switch (viewName) {
    case 'dashboard': renderDashboard(); break;
    case 'weekly-planner': renderWeeklyPlanner(); break;
    case 'habits': renderHabits(); break;
    case 'health': renderHealthDetail(); break;
    case 'meals': renderMealPlanDetail(); break;
    case 'soyjoy': renderSoyjoyDetail(); break;
    case 'garden': renderGardenDetail(); break;
    case 'sync': updateSyncStatus(); break;
  }
}

function updateWeekLabel() {
  const dates = getWeekDates(currentWeekOffset);
  const label = `${formatDateShort(dates[0])} - ${formatDateShort(dates[6])}`;
  document.getElementById('weekLabel').textContent = label;
  const todayLabel = document.getElementById('todayDateLabel');
  if (todayLabel) todayLabel.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ---- Dashboard Rendering ----
function renderDashboard() {
  renderDashboardStats();
  renderTodayFocus();
  renderHabitChart();
  renderHarvestList();
  renderExperimentList();
}

function renderDashboardStats() {
  const health = projectData.health;
  const meals = projectData.meals;
  document.getElementById('statCalories').textContent = health ? health.dailyCalorieTarget : '--';

  if (health && health.weeklyWorkoutPlan) {
    const workoutDays = health.weeklyWorkoutPlan.filter(w => w.type !== 'Rest' && !w.type.includes('Rest')).length;
    document.getElementById('statWorkouts').textContent = workoutDays;
  } else {
    document.getElementById('statWorkouts').textContent = '--';
  }

  if (meals && meals.weeklyMealPlan) {
    document.getElementById('statMeals').textContent = meals.weeklyMealPlan.length * 3;
  } else {
    document.getElementById('statMeals').textContent = '--';
  }

  // Calculate habit streak
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateISO(d);
    const dayCompleted = habits.some(h => habitChecks[h.id + '-' + dateStr]);
    if (dayCompleted) streak++;
    else if (i > 0) break;
  }
  document.getElementById('statHabits').textContent = streak;
}

function renderTodayFocus() {
  const dayName = getTodayDayName();

  // Workout
  const workoutEl = document.getElementById('todayWorkout');
  if (projectData.health && projectData.health.weeklyWorkoutPlan) {
    const workout = projectData.health.weeklyWorkoutPlan.find(w => w.day === dayName);
    if (workout) {
      workoutEl.innerHTML = `<ul>
        <li><strong>${workout.type}</strong></li>
        <li>Duration: ${workout.duration}</li>
        <li>${workout.notes}</li>
      </ul>`;
    }
  } else {
    workoutEl.innerHTML = '<p class="empty-state">Import data from Health & Fitness project</p>';
  }

  // Meals
  const mealsEl = document.getElementById('todayMeals');
  if (projectData.meals && projectData.meals.weeklyMealPlan) {
    const meal = projectData.meals.weeklyMealPlan.find(m => m.day === dayName);
    if (meal) {
      mealsEl.innerHTML = `<ul>
        <li><strong>Breakfast:</strong> ${meal.breakfast}</li>
        <li><strong>Lunch:</strong> ${meal.lunch}</li>
        <li><strong>Dinner:</strong> ${meal.dinner}</li>
        <li><strong>Snacks:</strong> ${meal.snacks}</li>
        <li style="color:var(--accent);font-weight:600;">${meal.calories} cal</li>
      </ul>`;
    }
  } else {
    mealsEl.innerHTML = '<p class="empty-state">Import data from Meal Plan project</p>';
  }

  // Garden
  const gardenEl = document.getElementById('todayGarden');
  if (projectData.garden) {
    const tasks = projectData.garden.weeklyTasks || [];
    const harvests = (projectData.garden.harvestSchedule || []).filter(h => h.readiness === 'ready');
    let html = '<ul>';
    if (harvests.length > 0) html += `<li><strong>Ready to harvest:</strong> ${harvests.map(h => h.crop).join(', ')}</li>`;
    tasks.slice(0, 3).forEach(t => { html += `<li>${t}</li>`; });
    if (projectData.garden.notes) html += `<li style="font-style:italic;color:var(--text-muted);">${projectData.garden.notes.substring(0, 80)}...</li>`;
    html += '</ul>';
    gardenEl.innerHTML = html;
  } else {
    gardenEl.innerHTML = '<p class="empty-state">Import data from Sunnyvale Garden project</p>';
  }

  // SoyJoy
  const soyjoyEl = document.getElementById('todaySoyjoy');
  if (projectData.soyjoy) {
    const active = (projectData.soyjoy.experiments || []).filter(e => e.status === 'active');
    const mealLinked = active.filter(e => e.feedToMealPlan);
    let html = '<ul>';
    active.forEach(e => {
      html += `<li><strong>${e.name}</strong>${e.feedToMealPlan ? ' (in meal plan: ' + e.mealPlanDay + ')' : ''}</li>`;
    });
    if (active.length === 0) html += '<li class="empty-state">No active experiments</li>';
    html += '</ul>';
    soyjoyEl.innerHTML = html;
  } else {
    soyjoyEl.innerHTML = '<p class="empty-state">Import data from SoyJoy project</p>';
  }
}

function renderHarvestList() {
  const el = document.getElementById('harvestList');
  if (!projectData.garden || !projectData.garden.harvestSchedule) {
    el.innerHTML = '<p class="empty-state">No harvest data yet. Import from Sunnyvale Garden project.</p>';
    return;
  }
  el.innerHTML = projectData.garden.harvestSchedule.map(h => {
    const badgeClass = h.readiness === 'ready' ? 'harvest-ready' : h.readiness === 'soon' ? 'harvest-soon' : 'harvest-later';
    return `<div class="harvest-item">
      <div><strong>${h.crop}</strong><br><span class="text-muted text-xs">${h.notes}</span></div>
      <span class="harvest-badge ${badgeClass}">${h.estimatedDate}</span>
    </div>`;
  }).join('');
}

function renderExperimentList() {
  const el = document.getElementById('experimentList');
  if (!projectData.soyjoy || !projectData.soyjoy.experiments) {
    el.innerHTML = '<p class="empty-state">No experiments yet. Import from SoyJoy project.</p>';
    return;
  }
  el.innerHTML = projectData.soyjoy.experiments.map(e => {
    const badgeClass = e.status === 'active' ? 'exp-active' : 'exp-planned';
    return `<div class="experiment-item">
      <div><strong>${e.name}</strong><br><span class="text-muted text-xs">${e.notes.substring(0, 60)}...</span></div>
      <span class="harvest-badge ${badgeClass}">${e.status}</span>
    </div>`;
  }).join('');
}

// ---- Habit Chart ----
function renderHabitChart() {
  const canvas = document.getElementById('habitChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = { top: 20, right: 20, bottom: 36, left: 40 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const dates = getWeekDates(currentWeekOffset);

  // Grid lines
  ctx.strokeStyle = '#2A2E3F';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    ctx.fillStyle = '#5C6078';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(100 - 25 * i) + '%', padding.left - 8, y + 4);
  }

  // Day labels
  ctx.fillStyle = '#5C6078';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  const colW = chartW / 7;

  // Calculate per-category completion for each day
  const categories = ['health', 'meals', 'garden', 'soyjoy'];
  const catColors = [CATEGORY_COLORS.health, CATEGORY_COLORS.meals, CATEGORY_COLORS.garden, CATEGORY_COLORS.soyjoy];

  dates.forEach((date, di) => {
    const x = padding.left + colW * di + colW / 2;
    ctx.fillStyle = isToday(date) ? '#F59E0B' : '#5C6078';
    ctx.fillText(DAY_NAMES_SHORT[di], x, h - 10);

    const barWidth = 10;
    const gap = 2;
    const totalBarWidth = categories.length * barWidth + (categories.length - 1) * gap;
    const startX = x - totalBarWidth / 2;

    categories.forEach((cat, ci) => {
      const catHabits = habits.filter(hb => hb.category === cat);
      if (catHabits.length === 0) return;
      const completed = catHabits.filter(hb => habitChecks[hb.id + '-' + formatDateISO(date)]).length;
      const pct = completed / catHabits.length;
      const barH = pct * chartH;
      const bx = startX + ci * (barWidth + gap);
      const by = padding.top + chartH - barH;

      ctx.beginPath();
      const r = 3;
      if (barH > r * 2) {
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + barWidth - r, by);
        ctx.quadraticCurveTo(bx + barWidth, by, bx + barWidth, by + r);
        ctx.lineTo(bx + barWidth, by + barH);
        ctx.lineTo(bx, by + barH);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
      } else if (barH > 0) {
        ctx.rect(bx, by, barWidth, barH);
      }
      ctx.closePath();
      ctx.fillStyle = catColors[ci];
      ctx.fill();
    });
  });
}

// ---- Weekly Planner ----
function renderWeeklyPlanner() {
  const grid = document.getElementById('weekGrid');
  const dates = getWeekDates(currentWeekOffset);

  grid.innerHTML = dates.map((date, i) => {
    const today = isToday(date) ? ' today' : '';
    const dayName = DAY_NAMES[i];
    let items = '';

    // Workout
    if (projectData.health && projectData.health.weeklyWorkoutPlan) {
      const w = projectData.health.weeklyWorkoutPlan.find(wp => wp.day === dayName);
      if (w && w.type !== 'Rest') {
        items += `<div class="planner-item type-workout">
          <div class="planner-item-label">Workout</div>
          <div class="planner-item-text">${w.type} (${w.duration})</div>
        </div>`;
      }
    }

    // Meals
    if (projectData.meals && projectData.meals.weeklyMealPlan) {
      const m = projectData.meals.weeklyMealPlan.find(mp => mp.day === dayName);
      if (m) {
        items += `<div class="planner-item type-meal">
          <div class="planner-item-label">Breakfast</div>
          <div class="planner-item-text">${m.breakfast}</div>
        </div>`;
        items += `<div class="planner-item type-meal">
          <div class="planner-item-label">Lunch</div>
          <div class="planner-item-text">${m.lunch}</div>
        </div>`;
        items += `<div class="planner-item type-meal">
          <div class="planner-item-label">Dinner</div>
          <div class="planner-item-text">${m.dinner}</div>
        </div>`;
      }
    }

    // Garden tasks (show on all days for weekly tasks, or specific days)
    if (projectData.garden && projectData.garden.weeklyTasks && (i === 0 || i === 5)) {
      const tasks = i === 0 ? projectData.garden.weeklyTasks.slice(0, 3) : projectData.garden.weeklyTasks.slice(3);
      tasks.forEach(t => {
        items += `<div class="planner-item type-garden">
          <div class="planner-item-label">Garden</div>
          <div class="planner-item-text">${t}</div>
        </div>`;
      });
    }

    // SoyJoy experiments
    if (projectData.soyjoy && projectData.soyjoy.experiments) {
      projectData.soyjoy.experiments.filter(e => e.feedToMealPlan && e.mealPlanDay === dayName).forEach(e => {
        items += `<div class="planner-item type-soyjoy">
          <div class="planner-item-label">SoyJoy</div>
          <div class="planner-item-text">${e.name}</div>
        </div>`;
      });
    }

    if (!items) {
      items = '<div class="planner-item type-general"><div class="planner-item-text" style="color:var(--text-muted);font-style:italic;">No items</div></div>';
    }

    return `<div class="day-column${today}">
      <div class="day-header">
        <div class="day-name">${DAY_NAMES_SHORT[i]}</div>
        <div class="day-date">${date.getDate()}</div>
      </div>
      <div class="day-body">${items}</div>
    </div>`;
  }).join('');
}

// ---- Habit Tracker ----
function renderHabits() {
  renderHabitsGrid();
  renderHeatmap();
}

function renderHabitsGrid() {
  const grid = document.getElementById('habitsGrid');
  const dates = getWeekDates(currentWeekOffset);

  let html = '<div class="habit-header-cell">Habit</div>';
  dates.forEach((d, i) => {
    const todayClass = isToday(d) ? ' today-col' : '';
    html += `<div class="habit-day-header${todayClass}">${DAY_NAMES_SHORT[i]}<br>${d.getDate()}</div>`;
  });

  habits.forEach(habit => {
    const dotColor = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.general;
    html += `<div class="habit-name-cell">
      <span class="habit-cat-dot" style="background:${dotColor}"></span>
      ${habit.name}
      <button class="habit-delete-btn" data-habit-id="${habit.id}" title="Delete habit">&times;</button>
    </div>`;
    dates.forEach(d => {
      const key = habit.id + '-' + formatDateISO(d);
      const checked = habitChecks[key] ? ' checked' : '';
      const todayClass = isToday(d) ? ' today-col' : '';
      html += `<div class="habit-check-cell${todayClass}">
        <div class="habit-checkbox${checked}" data-key="${key}">${habitChecks[key] ? '&#10003;' : ''}</div>
      </div>`;
    });
  });

  grid.innerHTML = html;

  // Checkbox click handlers
  grid.querySelectorAll('.habit-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      const key = cb.dataset.key;
      habitChecks[key] = !habitChecks[key];
      if (!habitChecks[key]) delete habitChecks[key];
      persist();
      cb.classList.toggle('checked');
      cb.innerHTML = habitChecks[key] ? '&#10003;' : '';
    });
  });

  // Delete handlers
  grid.querySelectorAll('.habit-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.habitId;
      habits = habits.filter(h => h.id !== id);
      persist();
      renderHabits();
    });
  });
}

function renderHeatmap() {
  const container = document.getElementById('heatmapContainer');
  const today = new Date();
  let html = '';

  for (let week = 3; week >= 0; week--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (week * 7 + getDayOfWeekIndex(today)));

    html += '<div class="heatmap-week">';
    html += `<div class="heatmap-label">${formatDateShort(weekStart)}</div>`;

    for (let day = 0; day < 7; day++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + day);
      const dateStr = formatDateISO(d);

      const totalHabits = habits.length;
      if (totalHabits === 0) {
        html += '<div class="heatmap-cell"></div>';
        continue;
      }

      const completed = habits.filter(h => habitChecks[h.id + '-' + dateStr]).length;
      const pct = completed / totalHabits;
      let level = '';
      if (pct > 0.75) level = 'level-4';
      else if (pct > 0.5) level = 'level-3';
      else if (pct > 0.25) level = 'level-2';
      else if (pct > 0) level = 'level-1';

      html += `<div class="heatmap-cell ${level}" title="${formatDateShort(d)}: ${completed}/${totalHabits}"></div>`;
    }
    html += '</div>';
  }

  container.innerHTML = html;
}

// ---- Project Detail Views ----
function renderHealthDetail() {
  const d = projectData.health;
  if (!d) return;

  document.getElementById('healthGoals').innerHTML = `<ul>
    <li><strong>Daily Calories:</strong> ${d.dailyCalorieTarget} kcal</li>
    <li><strong>Daily Protein:</strong> ${d.dailyProteinTarget}g</li>
    <li><strong>Nutrient Focus:</strong> ${d.nutrientFocus.join(', ')}</li>
  </ul>`;

  document.getElementById('workoutPlan').innerHTML = '<ul>' +
    d.weeklyWorkoutPlan.map(w => `<li><strong>${w.day}:</strong> ${w.type} (${w.duration}) - ${w.notes}</li>`).join('') +
    '</ul>';

  document.getElementById('supplementsList').innerHTML = '<ul>' +
    d.supplements.map(s => `<li>${s}</li>`).join('') +
    '</ul>';

  const m = d.recentMetrics;
  document.getElementById('healthMetrics').innerHTML = `<ul>
    <li><strong>Resting HR:</strong> ${m.avgRestingHR} bpm</li>
    <li><strong>Avg Sleep:</strong> ${m.avgSleep}</li>
    <li><strong>Avg Steps:</strong> ${m.avgSteps.toLocaleString()}</li>
    <li><strong>Weight:</strong> ${m.weight}</li>
    <li><strong>Last Lab Date:</strong> ${m.lastLabDate}</li>
  </ul>`;
}

function renderMealPlanDetail() {
  const d = projectData.meals;
  if (!d) return;
  const dates = getWeekDates(currentWeekOffset);

  document.getElementById('mealPlanWeek').innerHTML = d.weeklyMealPlan.map((m, i) => {
    const todayClass = dates[i] && isToday(dates[i]) ? ' today' : '';
    return `<div class="meal-day-card${todayClass}">
      <h4>${m.day}</h4>
      <div class="meal-slot"><div class="meal-slot-label">Breakfast</div><div class="meal-slot-content">${m.breakfast}</div></div>
      <div class="meal-slot"><div class="meal-slot-label">Lunch</div><div class="meal-slot-content">${m.lunch}</div></div>
      <div class="meal-slot"><div class="meal-slot-label">Dinner</div><div class="meal-slot-content">${m.dinner}</div></div>
      <div class="meal-slot"><div class="meal-slot-label">Snacks</div><div class="meal-slot-content">${m.snacks}</div></div>
      <div class="meal-calories">${m.calories} cal</div>
    </div>`;
  }).join('');
}

function renderSoyjoyDetail() {
  const d = projectData.soyjoy;
  if (!d) return;

  document.getElementById('soyjoyExperiments').innerHTML = '<ul>' +
    d.experiments.map(e => {
      const badge = e.status === 'active' ? '<span style="color:#F472B6;"> [Active]</span>' : '<span style="color:#A78BFA;"> [Planned]</span>';
      return `<li><strong>${e.name}</strong>${badge}<br><span class="text-muted text-sm">${e.notes}</span></li>`;
    }).join('') + '</ul>';

  const mealLinked = d.experiments.filter(e => e.feedToMealPlan);
  document.getElementById('soyjoyToMealPlan').innerHTML = mealLinked.length > 0
    ? '<ul>' + mealLinked.map(e => `<li><strong>${e.name}</strong> &rarr; ${e.mealPlanDay}</li>`).join('') + '</ul>'
    : '<p class="empty-state">No recipes linked to meal plan</p>';

  document.getElementById('productLine').innerHTML = '<ul>' +
    d.productLine.map(p => `<li><strong>${p.product}</strong> - ${p.stage} (Target: ${p.targetLaunch})</li>`).join('') +
    '</ul>';
}

function renderGardenDetail() {
  const d = projectData.garden;
  if (!d) return;

  document.getElementById('gardenCrops').innerHTML = '<ul>' +
    d.crops.map(c => `<li><strong>${c.name}</strong> - ${c.status} (${c.bed})</li>`).join('') +
    '</ul>';

  document.getElementById('harvestSchedule').innerHTML = '<ul>' +
    d.harvestSchedule.map(h => {
      const color = h.readiness === 'ready' ? '#34D399' : h.readiness === 'soon' ? '#FBBF24' : '#60A5FA';
      return `<li><strong style="color:${color}">${h.crop}</strong> - ${h.estimatedDate}: ${h.notes}</li>`;
    }).join('') + '</ul>';

  document.getElementById('gardenTasks').innerHTML = '<ul>' +
    d.weeklyTasks.map(t => `<li>${t}</li>`).join('') +
    '</ul>';

  document.getElementById('gardenNotes').innerHTML = `<p>${d.notes}</p>`;
}

// ---- Data Import / Export ----
function importProjectData(projectName, data) {
  projectData[projectName] = data;
  projectData[projectName]._lastSync = new Date().toISOString();
  persist();
  updateSyncStatus();
  showToast(`${projectName} data imported successfully!`);
  // Re-render active view
  const activeView = document.querySelector('.nav-item.active');
  if (activeView) renderCurrentView(activeView.dataset.view);
}

function updateSyncStatus() {
  ['health', 'meals', 'soyjoy', 'garden'].forEach(proj => {
    const statusEl = document.getElementById('syncStatus' + proj.charAt(0).toUpperCase() + proj.slice(1));
    const lastSyncEl = document.getElementById('lastSync' + proj.charAt(0).toUpperCase() + proj.slice(1));
    const sidebarDot = document.querySelector(`.nav-item[data-view="${proj}"] .sync-dot`);

    if (projectData[proj]) {
      if (statusEl) { statusEl.textContent = 'Synced'; statusEl.classList.add('synced'); }
      if (lastSyncEl) lastSyncEl.textContent = 'Last sync: ' + new Date(projectData[proj]._lastSync || Date.now()).toLocaleString();
      if (sidebarDot) { sidebarDot.classList.remove('sync-pending', 'sync-error'); sidebarDot.classList.add('sync-ok'); }
    } else {
      if (statusEl) { statusEl.textContent = 'Not synced'; statusEl.classList.remove('synced'); }
      if (lastSyncEl) lastSyncEl.textContent = 'Never synced';
    }
  });
}

function exportAllData() {
  const data = {
    exportDate: new Date().toISOString(),
    projectData,
    habits,
    habitChecks
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'life-dashboard-backup-' + formatDateISO(new Date()) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported successfully!');
}

function showToast(msg, isError) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---- Automation Guide ----
function showAutomationGuide() {
  document.getElementById('automationGuide').innerHTML = `
    <h4>Approach 1: Manual Copy-Paste (Easiest)</h4>
    <ol>
      <li>Open each Claude project (Health, Meals, SoyJoy, Garden)</li>
      <li>Ask Claude to "export my current data as JSON in this format:" and paste the schema below</li>
      <li>Copy the JSON output from Claude's response</li>
      <li>Click "Paste JSON" for each project in the Data Sync page</li>
    </ol>
    <p>Example prompt for your Health & Fitness project:</p>
    <pre>Please export my current health data as JSON with this structure:
{
  "dailyCalorieTarget": number,
  "dailyProteinTarget": number,
  "weeklyWorkoutPlan": [{"day": "Monday", "type": "...", "duration": "...", "notes": "..."}],
  "supplements": ["..."],
  "recentMetrics": {"avgRestingHR": num, "avgSleep": "...", "avgSteps": num, "weight": "...", "lastLabDate": "..."},
  "nutrientFocus": ["..."]
}</pre>

    <h4>Approach 2: Semi-Automated with Python Script</h4>
    <p>Use the Claude API to programmatically extract data from each project context and save as JSON files.</p>
    <pre>import anthropic
import json
from datetime import datetime

client = anthropic.Anthropic()

# Define export prompts for each project
projects = {
    "health": {
        "system": "You are the Health & Fitness project assistant. You have access to the user's health data.",
        "prompt": "Export current health data as JSON: dailyCalorieTarget, dailyProteinTarget, weeklyWorkoutPlan, supplements, recentMetrics, nutrientFocus."
    },
    "meals": {
        "system": "You are the Meal Plan & Recipes project assistant.",
        "prompt": "Export the weekly meal plan as JSON: weeklyMealPlan (day, breakfast, lunch, dinner, snacks, calories), dietaryRestrictions, pantryHighlights, seasonalIngredients."
    },
    "garden": {
        "system": "You are the Sunnyvale Garden project assistant.",
        "prompt": "Export garden data as JSON: crops, harvestSchedule, weeklyTasks, notes."
    },
    "soyjoy": {
        "system": "You are the SoyJoy Lab project assistant.",
        "prompt": "Export experiment data as JSON: experiments (name, status, notes, feedToMealPlan, mealPlanDay), productLine."
    }
}

for name, config in projects.items():
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=config["system"],
        messages=[{"role": "user", "content": config["prompt"]}]
    )
    # Parse JSON from response
    data = json.loads(response.content[0].text)
    data["_lastSync"] = datetime.now().isoformat()
    with open(f"dashboard_data/{name}.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Exported {name} data")</pre>

    <h4>Approach 3: Fully Automated with Cron + Claude API</h4>
    <p>Set up a scheduled task that runs the export script automatically and updates the dashboard data.</p>
    <pre># Run every Sunday at 8 PM to prep for the week
0 20 * * 0 cd /path/to/scripts && python3 sync_dashboard.py

# Or use Claude's tool_use for structured output:
# The API can return JSON that exactly matches your schema
# using the tool_use feature for guaranteed structure</pre>
    <p>For the most reliable structured output, use Claude's <code>tool_use</code> feature:</p>
    <pre>response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    tools=[{
        "name": "export_meal_plan",
        "description": "Export the weekly meal plan data",
        "input_schema": {
            "type": "object",
            "properties": {
                "weeklyMealPlan": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "day": {"type": "string"},
                            "breakfast": {"type": "string"},
                            "lunch": {"type": "string"},
                            "dinner": {"type": "string"},
                            "snacks": {"type": "string"},
                            "calories": {"type": "number"}
                        }
                    }
                }
            },
            "required": ["weeklyMealPlan"]
        }
    }],
    messages=[{"role": "user", "content": "Export this week's meal plan"}]
)</pre>

    <h4>Tip: Cross-Project Sync</h4>
    <p>To keep projects in sync (e.g., garden harvests &rarr; meal plan), include context from one project when prompting another:</p>
    <ol>
      <li>First, export garden data to get the harvest schedule</li>
      <li>Then, when exporting the meal plan, include: "These crops are ready to harvest this week: [kale, chard, lettuce]. Incorporate them into the meal plan."</li>
      <li>Similarly, include SoyJoy experiments: "I'm testing okara sausages on Saturday, add them to breakfast."</li>
    </ol>
  `;
  document.getElementById('automationModal').classList.add('open');
}

// ---- Event Listeners ----
function initEventListeners() {
  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  // Week navigation
  document.getElementById('prevWeek').addEventListener('click', () => {
    currentWeekOffset--;
    persist();
    const activeView = document.querySelector('.nav-item.active');
    renderCurrentView(activeView ? activeView.dataset.view : 'dashboard');
  });

  document.getElementById('nextWeek').addEventListener('click', () => {
    currentWeekOffset++;
    persist();
    const activeView = document.querySelector('.nav-item.active');
    renderCurrentView(activeView ? activeView.dataset.view : 'dashboard');
  });

  document.getElementById('todayBtn').addEventListener('click', () => {
    currentWeekOffset = 0;
    persist();
    const activeView = document.querySelector('.nav-item.active');
    renderCurrentView(activeView ? activeView.dataset.view : 'dashboard');
  });

  // Add Habit
  document.getElementById('addHabitBtn').addEventListener('click', () => {
    document.getElementById('addHabitModal').classList.add('open');
    document.getElementById('newHabitName').value = '';
    document.getElementById('newHabitName').focus();
  });

  document.getElementById('closeAddHabitModal').addEventListener('click', () => {
    document.getElementById('addHabitModal').classList.remove('open');
  });

  document.getElementById('cancelAddHabit').addEventListener('click', () => {
    document.getElementById('addHabitModal').classList.remove('open');
  });

  document.getElementById('confirmAddHabit').addEventListener('click', () => {
    const name = document.getElementById('newHabitName').value.trim();
    const category = document.getElementById('newHabitCategory').value;
    if (!name) return;
    habits.push({ id: 'h' + Date.now(), name, category });
    persist();
    document.getElementById('addHabitModal').classList.remove('open');
    renderHabits();
  });

  // File imports
  document.querySelectorAll('.hidden-file').forEach(input => {
    input.addEventListener('change', (e) => {
      const project = input.dataset.project;
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          importProjectData(project, data);
        } catch (err) {
          showToast('Invalid JSON file: ' + err.message, true);
        }
      };
      reader.readAsText(file);
      input.value = '';
    });
  });

  // Paste JSON buttons
  let currentPasteProject = null;
  document.querySelectorAll('[data-paste]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPasteProject = btn.dataset.paste;
      document.getElementById('pasteModalHint').textContent = `Paste JSON data for ${currentPasteProject} project:`;
      document.getElementById('pasteTextarea').value = '';
      document.getElementById('pasteModal').classList.add('open');
    });
  });

  document.getElementById('closePasteModal').addEventListener('click', () => {
    document.getElementById('pasteModal').classList.remove('open');
  });

  document.getElementById('cancelPasteBtn').addEventListener('click', () => {
    document.getElementById('pasteModal').classList.remove('open');
  });

  document.getElementById('confirmPasteBtn').addEventListener('click', () => {
    const text = document.getElementById('pasteTextarea').value.trim();
    if (!text || !currentPasteProject) return;
    try {
      const data = JSON.parse(text);
      importProjectData(currentPasteProject, data);
      document.getElementById('pasteModal').classList.remove('open');
    } catch (err) {
      showToast('Invalid JSON: ' + err.message, true);
    }
  });

  // Sample data buttons
  document.querySelectorAll('[data-sample]').forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.dataset.sample;
      if (SAMPLE_DATA[project]) {
        importProjectData(project, JSON.parse(JSON.stringify(SAMPLE_DATA[project])));
      }
    });
  });

  // Export
  document.getElementById('exportAllBtn').addEventListener('click', exportAllData);

  // Automation guide
  document.getElementById('showAutomationBtn').addEventListener('click', showAutomationGuide);

  document.getElementById('closeAutomationModal').addEventListener('click', () => {
    document.getElementById('automationModal').classList.remove('open');
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
}

// ---- Init ----
function init() {
  initEventListeners();
  updateWeekLabel();
  updateSyncStatus();
  renderDashboard();
}

init();
window.addEventListener('resize', () => {
  const activeView = document.querySelector('.nav-item.active');
  if (activeView && activeView.dataset.view === 'dashboard') renderHabitChart();
});
