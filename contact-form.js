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
      'Fresh Fruit (Grapes or Seasonal Berries)', 'Dried Fruit (Apricots, Oranges, Figs or Dates)'] },
    bread_crackers: { title: 'Breadsticks or Crackers', subtitle: 'Choose 1', items: [
      'Breadsticks', 'Crackers'] },
    nuts_olives: { title: 'Mixed Nuts or Olives', subtitle: 'Choose 1', items: [
      'Mixed Nuts', 'Olives'] },
    included: { title: 'Included', subtitle: '', items: [
      'Honey Drizzle','Sweet Treat'] }
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
    nuts_olives: { title: 'Flavored Nuts, Raw Nuts, Cornichons, or Stuffed Olives', subtitle: 'Choose 1', items: [
      'Flavored Nuts', 'Raw Nuts', 'Cornichons', 'Stuffed Olives'] },
    honey_fig: { title: 'Flavored Honey or Fig Spread', subtitle: 'Choose 1', items: [
      'Flavored Honey', 'Fig Spread'] },
    included: { title: 'Included', subtitle: '', items: [
      'La Panzanella Artisan Crackers', 'Sweet Treat'] }
  }
};

const packageSelect = document.getElementById('package');
const menuSelectionsDiv = document.getElementById('menuSelections');
const contactForm = document.getElementById('contactForm');


function buildMenuSelections(pkg){
  menuSelectionsDiv.innerHTML='';
  if(pkg==='custom'){
    // Show custom request box
    const customBox = document.createElement('div');
    customBox.className = 'form-group';
    const label = document.createElement('label');
    label.htmlFor = 'customRequest';
    label.textContent = 'Describe your custom idea or request:';
    const textarea = document.createElement('textarea');
    textarea.id = 'customRequest';
    textarea.name = 'customRequest';
    textarea.rows = 4;
    textarea.placeholder = 'Tell us what you have in mind!';
    customBox.appendChild(label);
    customBox.appendChild(textarea);
    menuSelectionsDiv.appendChild(customBox);
    return;
  }
  if(!menuData[pkg]) return;
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
    // Special case for Fruits: use number inputs for Classico/Beyond
    if(cat==='fruits'){
      ['Fresh Fruit (Grapes or Seasonal Berries)','Dried Fruit (Apricots, Oranges, Figs or Dates)'].forEach((item,i)=>{
        const wrap=document.createElement('div');
        wrap.className='checkbox-wrapper';
        const label=document.createElement('label');
        label.textContent=item;
        label.htmlFor=`fruits_num_${i}`;
        const num=document.createElement('input');
        num.type='number';
        num.id=`fruits_num_${i}`;
        num.name=`fruits_num_${i}`;
        num.min=0;num.max=3;num.value=0;num.style.width='60px';
        num.setAttribute('aria-label',item);
        wrap.appendChild(label);
        wrap.appendChild(num);
        items.appendChild(wrap);
      });
      // Add helper note
      const note=document.createElement('div');
      note.className='menu-category-sub';
      note.textContent='Total must add up to 3';
      items.appendChild(note);
    }else if(cat==='nuts_olives' || cat==='honey_fig' || cat==='bread_crackers'){
      catData.items.forEach((item,i)=>{
        const wrap=document.createElement('div');
        wrap.className='checkbox-wrapper';
        const cb=document.createElement('input');
        cb.type='radio';
        cb.id=`${cat}_${i}`;
        cb.name=cat;
        cb.value=item;
        const label=document.createElement('label');
        label.htmlFor=cb.id;label.textContent=item;
        wrap.appendChild(cb);wrap.appendChild(label);items.appendChild(wrap);
      });
    }else if(cat==='included'){
      // Show included items as a note, not selectable
      const note=document.createElement('div');
      note.className='menu-category-sub';
      note.textContent='Included: '+catData.items.join(', ');
      items.appendChild(note);
    }else{
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
    }
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
      if(cat==='fruits'){
        // Get number values for fruits
        const fresh = parseInt(contactForm.querySelector('input[name="fruits_num_0"]').value)||0;
        const dried = parseInt(contactForm.querySelector('input[name="fruits_num_1"]').value)||0;
        selectionsText+=`\nFRUITS:\n  • Fresh Fruit: ${fresh}\n  • Dried Fruit: ${dried}\n`;
      }else if(cat==='nuts_olives' || cat==='honey_fig'){
        const selected = contactForm.querySelector(`input[name='${cat}']:checked`);
        if(selected){
          selectionsText+=`\n${cat.replace('_',' ').toUpperCase()}:\n  • ${selected.value}\n`;
        }
      }else{
        const checked=[...contactForm.querySelectorAll(`input[name='${cat}']:checked`)].map(c=>c.value);
        if(checked.length){
          selectionsText+=`\n${cat.toUpperCase()}:\n`+checked.map(v=>`  • ${v}`).join('\n')+'\n';
        }
      }
    });
    if(selectionsText){selectionsText='MENU SELECTIONS:\n'+selectionsText.trim();}
  }
  document.getElementById('menuSelectionsHidden').value = selectionsText.trim();
  // Let the browser perform the POST to FormSubmit.
});
