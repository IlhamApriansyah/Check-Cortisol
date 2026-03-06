document.addEventListener('DOMContentLoaded', function () {

    const stressSlider = document.getElementById('stress');
    const stressDisplay = document.getElementById('stress-value');

    if (stressSlider && stressDisplay) {
        stressSlider.addEventListener('input', function () {
            stressDisplay.textContent = this.value;
        });
    }

    const form   = document.getElementById('cortisol-form');
    const modal  = document.getElementById('result-modal');

    if (!form) {
        console.error('Form dengan id="cortisol-form" tidak ditemukan');
        return;
    }

    if (!modal) {
        console.error('Modal dengan id="result-modal" tidak ditemukan');
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const age      = parseInt(document.getElementById('age')?.value) || 35;
        const gender   = document.querySelector('input[name="gender"]:checked')?.value || 'male';
        const stress   = parseInt(stressSlider?.value) || 5;
        const sleep    = document.getElementById('sleep')?.value || '67';
        const exercise = document.getElementById('exercise')?.value || 'med';

        const symptomsChecked = document.querySelectorAll('input[name="symptom"]:checked');
        const symptomCount = symptomsChecked.length;

        let score = 18;
        score += (age > 50) ? 4 : 0;
        score += (gender === 'female') ? 2 : 0;
        score += (stress - 5) * 2.2;
        if (sleep === 'less6')    score += 9;
        else if (sleep === '67')  score += 3;
        else if (sleep === 'more8') score -= 3;
        if (exercise === 'none')  score += 8;
        else if (exercise === 'low') score += 4;
        else if (exercise === 'high') score -= 6;
        score += symptomCount * 4.5;

        score = Math.max(8, Math.min(55, Math.round(score)));

        let levelText = '—';
        let colorClass = '';
        let explanation = '';
        let advice = '';

        if (score <= 22) {
            levelText   = 'RENDAH';
            colorClass  = 'text-blue-600';
            explanation = 'Kadar kortisol estimasi rendah.';
            advice      = 'Kemungkinan kelelahan adrenal atau respons stres yang kurang. Segera konsultasikan dengan dokter spesialis endokrin.';
        } else if (score <= 34) {
            levelText   = 'NORMAL';
            colorClass  = 'text-emerald-600';
            explanation = 'Kadar kortisol estimasi berada dalam rentang normal.';
            advice      = 'Pertahankan pola hidup sehat saat ini. Tidur cukup dan manajemen stres tetap penting.';
        } else {
            levelText   = 'TINGGI';
            colorClass  = 'text-red-600';
            explanation = 'Kadar kortisol estimasi tinggi (kemungkinan stres kronis).';
            advice      = 'Pertimbangkan teknik relaksasi, olahraga ringan rutin, dan konsultasi dengan dokter atau psikolog.';
        }

        // Update konten modal
        const levelEl       = document.getElementById('result-level');
        const explanationEl = document.getElementById('result-explanation');
        const scoreEl       = document.getElementById('result-score');
        const adviceEl      = document.getElementById('result-advice');

        if (levelEl) {
            levelEl.innerHTML = `<span class="${colorClass}">${levelText}</span>`;
        }
        if (explanationEl) explanationEl.textContent = explanation;
        if (scoreEl)       scoreEl.textContent = `Skor estimasi: ${score} / 55`;
        if (adviceEl)      adviceEl.textContent = advice;

        modal.classList.remove('hidden');
        modal.classList.add('flex');   

        console.log('Estimasi ditampilkan → Skor:', score, 'Level:', levelText);
    });

    document.querySelectorAll('[data-close-modal]').forEach(function (button) {
        button.addEventListener('click', function () {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    });

});


const themeToggle = document.getElementById('theme-toggle');
const sunIcon     = document.getElementById('sun-icon');
const moonIcon    = document.getElementById('moon-icon');

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    setTheme(savedTheme);
} else if (prefersDark) {
    setTheme('dark');
} else {
    setTheme('light');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
}

const menuToggle = document.getElementById('mobile-menu-toggle');
const menu = document.getElementById('mobile-menu');
const menuClose = document.getElementById('mobile-menu-close');

if (menuToggle && menu && menuClose) {
    menuToggle.addEventListener('click', () => {
        menu.classList.remove('hidden');
    });
    menuClose.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
    // Hide menu when clicking outside
    menu.addEventListener('click', (e) => {
        if (e.target === menu) menu.classList.add('hidden');
    });
}