const list = document.querySelector('#node-list');
const detail = document.querySelector('#node-detail');
const actAddress = document.querySelector('#act-address');

fetch('field-ledger.json').then(r => r.json()).then(field => {
  actAddress.textContent = field.act.address;
  field.nodes.forEach(node => {
    const button = document.createElement('button');
    button.className = 'node-button';
    button.id = `node-${node.slug}`;
    button.dataset.address = node.address;
    button.innerHTML = `<code>${node.address}</code><span>${node.title}</span><small>${node.classification}</small>`;
    button.addEventListener('click', () => select(node, true));
    list.append(button);
  });
  const fragment = decodeURIComponent(location.hash.slice(1));
  const initial = field.nodes.find(n => n.address === fragment || `node-${n.slug}` === fragment || n.slug === fragment) || field.nodes[0];
  select(initial, false);
}).catch(error => {
  detail.innerHTML = `<h3>Ledger unavailable</h3><p>${error.message}</p>`;
});

function select(node, updateUrl) {
  document.querySelectorAll('.node-button').forEach(button => button.classList.toggle('selected', button.dataset.address === node.address));
  const sources = node.sources.map(source => `<a href="${source.url}">${source.label}</a>`).join('<br>');
  const parents = node.parents.length ? node.parents.join('<br>') : 'None — selected boundary';
  detail.innerHTML = `<div class="classification">${node.classification}</div><h3>${node.title}</h3><p>${node.statement}</p><dl><dt>Address</dt><dd><a href="#${encodeURIComponent(node.address)}">${node.address}</a></dd><dt>Parents</dt><dd>${parents}</dd><dt>Sources</dt><dd>${sources || 'Retained act statement'}</dd><dt>Remainder</dt><dd>${node.remainder}</dd></dl>`;
  if (updateUrl) history.replaceState(null, '', `#${encodeURIComponent(node.address)}`);
}
