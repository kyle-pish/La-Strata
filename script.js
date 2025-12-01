
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let mobileBackdrop = null;

function createBackdrop(){
	if(mobileBackdrop) return mobileBackdrop;
	const d = document.createElement('div');
	d.className = 'mobile-backdrop';
	d.addEventListener('click', closeMobile);
	document.body.appendChild(d);
	mobileBackdrop = d;
	return d;
}

function showBackdrop(){
	const d = createBackdrop();
	// force reflow to allow transition
	window.getComputedStyle(d).opacity;
	d.classList.add('visible');
}

function hideBackdrop(){
	if(!mobileBackdrop) return;
	mobileBackdrop.classList.remove('visible');
}

function openMobile(){
	if(!menuBtn || !mobileMenu) return;
	menuBtn.setAttribute('aria-expanded','true');
	mobileMenu.classList.add('open');
	mobileMenu.setAttribute('aria-hidden','false');
	showBackdrop();
}

function closeMobile(){
	if(!menuBtn || !mobileMenu) return;
	menuBtn.setAttribute('aria-expanded','false');
	mobileMenu.classList.remove('open');
	mobileMenu.setAttribute('aria-hidden','true');
	hideBackdrop();
}

function toggleMobile(){
	if(!mobileMenu) return;
	if(mobileMenu.classList.contains('open')) closeMobile(); else openMobile();
}

if(menuBtn){
	menuBtn.addEventListener('click', (e)=>{ e.stopPropagation(); toggleMobile(); });
}

// Close mobile menu on Escape
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeMobile(); });

// Close when a mobile link is clicked
document.addEventListener('click', (e)=>{
	if(!mobileMenu) return;
	const a = e.target.closest('.mobile-menu a');
	if(a) closeMobile();
});


