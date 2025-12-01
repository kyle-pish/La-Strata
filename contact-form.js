// Dynamic contact form logic
const menuData = {
  classico: {
    meats: { title: 'Meats', subtitle: 'Choose 2', items: [
      'Salame Trio: (Peppered, Italian Dry, Calabrese)',
      'Spicy Trio: (Spicy Coppa, Sopressa Salame, Cooked Spicy Capocolla)',
      'Genoa Salame', 'Pepperoni', 'Summer Sausage'] },
    cheeses: { title: 'Cheeses', subtitle: 'Choose 3', items: [
      'Sharp Cheddar (Hard)', 'Havarti (Soft)', 'Aged Gouda (Hard)', 'Goat Cheese Log (Soft)'] },
    fruits: { title: 'Fruits', subtitle: 'Choose 3', items: [
      'Fresh Fruit (Grapes or Seasonal Berries)', 'Dried Fruit (Apricots, Oranges, Figs or Dates)'] }
  },
  beyond: {
    meats: { title: 'Meats', subtitle: 'Choose 2', items: [
      'Salame Trio: (Peppered, Italian Dry, Calabrese)',
      'Spicy Trio: (Spicy Coppa, Sopressa Salame, Cooked Spicy Capocolla)',
      'Genoa Salame', 'Pepperoni', 'Summer Sausage',
      'Prosciutto di Parma †', 'Jamon Serrano †', 'Smoked Duck Breast †'] },
    cheeses: { title: 'Cheeses', subtitle: 'Choose 3', items: [
      'Sharp Cheddar (Hard)', 'Havarti (Soft)', 'Aged Gouda (Hard)', 'Goat Cheese Log (Soft)',
      'Aged Manchego (Hard) †', 'Brie/Camembert (Soft) †', 'Boursin/Rondele Garlic & Herb (Soft) †', 'Stilton Blue (Soft) †'] },
    fruits: { title: 'Fruits', subtitle: 'Choose 3', items: [
      'Fresh Fruit (Grapes or Seasonal Berries)', 'Dried Fruit (Apricots, Oranges, Figs or Dates)'] },
    accompaniments: { title: 'Accompaniments', subtitle: 'Included selections', items: [
      'Flavored/Raw Nuts', 'Cornichons', 'Stuffed Olives', 'Flavored Honey/Fig Spread', 'La Panzanella Artisan Crackers'] }
  }
};

const packageSelect = document.getElementById('package');
const menuSelectionsDiv = document.getElementById('menuSelections');
const contactForm = document.getElementById('contactForm');

function buildMenuSelections(pkg){
  menuSelectionsDiv.innerHTML='';
  if(pkg==='custom' || !menuData[pkg]) return;
  const data = menuData[pkg];
  const container = document.createElement('div');
  container.className='menu-selection-container';
  const header=document.createElement('h3');
  header.className='menu-selection-header';
  header.textContent='Select Your Menu Items';
  container.appendChild(header);
  Object.keys(data).forEach(cat=>{
    const catData=data[cat];
    const section=document.createElement('div');
    section.className='menu-category';
    const title=document.createElement('div');
    title.className='menu-category-title';
    title.innerHTML=`${catData.title} <span class="menu-category-sub">${catData.subtitle}</span>`;
    section.appendChild(title);
    const items=document.createElement('div');
    items.className='menu-category-items';
    catData.items.forEach((item,i)=>{
      const wrap=document.createElement('div');
      wrap.className='checkbox-wrapper';
      const cb=document.createElement('input');
      cb.type='checkbox';
      cb.id=`${cat}_${i}`;
      cb.name=cat;
      cb.value=item;
      const label=document.createElement('label');
      label.htmlFor=cb.id;label.textContent=item;
      wrap.appendChild(cb);wrap.appendChild(label);items.appendChild(wrap);
    });
    section.appendChild(items);container.appendChild(section);
  });
  menuSelectionsDiv.appendChild(container);
}

packageSelect.addEventListener('change',()=>buildMenuSelections(packageSelect.value));

// Before native submit, compile menu selections into hidden field.
contactForm.addEventListener('submit',(e)=>{
  const hp = contactForm.querySelector('input[name="website"]').value;
  if(hp){return;} // bot/honeypot: allow silent drop
  const pkg = packageSelect.value;
  let selectionsText='';
  if(pkg && menuData[pkg]){
    Object.keys(menuData[pkg]).forEach(cat=>{
      const checked=[...contactForm.querySelectorAll(`input[name='${cat}']:checked`)].map(c=>c.value);
      if(checked.length){
        selectionsText+=`\n${cat.toUpperCase()}:\n`+checked.map(v=>`  • ${v}`).join('\n')+'\n';
      }
    });
    if(selectionsText){selectionsText='MENU SELECTIONS:\n'+selectionsText.trim();}
  }
  document.getElementById('menuSelectionsHidden').value = selectionsText.trim();
  // Let the browser perform the POST to FormSubmit.
});
