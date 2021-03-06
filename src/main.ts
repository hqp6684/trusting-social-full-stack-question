

if (window.hasOwnProperty('Worker')) {
  // Create seperate thread for different purposes
  let numberWorker = new Worker('number-generator.js');
  let listManager = new Worker('list-manager.js');
  let oldItemsManager = new Worker('old-items-manager.js');


  //   Start generating numbers
  numberWorker.postMessage('start');

  numberWorker.onmessage = (e: MessageEvent) => {
    listManager.postMessage(['newPair', e.data]);
  };

  listManager.onmessage = function(e: MessageEvent) {
    switch (e.data[0]) {
      case 'latest':
        displayLatest(e.data[1]);
        break;
      case 'oldest':
        oldItemsManager.postMessage(['oldest', e.data[1]]);
        break;
    }
  };

  oldItemsManager.onmessage = (e: MessageEvent) => {
    switch (e.data[0]) {
      case 'median':
        displayMedian(e.data[1]);
        break;
      case 'sum':
        displaySum(e.data[1]);
        break;
    }
  };


  // Register display sum button
  let sumButton = document.getElementById('sumButton') as HTMLElement;
  sumButton.addEventListener('click', () => {
    listManager.postMessage(['oldest']);
  });
  // Register display median button
  let medianButton = document.getElementById('medianButton') as HTMLElement;
  medianButton.addEventListener('click', () => {
    oldItemsManager.postMessage(['median']);
  });


} else {
  alert('Please run this page using Chrome/Firefox');
}

function displayLatest(items: Array<ListItem>) {
  let table = document.getElementById('latest') as HTMLTableElement;
  table.innerHTML = '';
  table.insertRow(0).insertCell(0).innerHTML = '<b>Latest</b>';
  items.forEach((item, index) => {

    let row = table.insertRow(index + 1);
    let cell = row.insertCell(0);
    cell.innerText = item.pair.value.toString();
  });
}



function displaySum(sum: number) {
  let tbody = document.getElementById('sum') as HTMLTableElement;
  let row = tbody.insertRow(0);
  let cell = row.insertCell();
  cell.innerHTML = sum.toString();
}
function displayMedian(median: number) {
  let tbody = document.getElementById('median') as HTMLTableElement;
  // reset row
  tbody.innerHTML = '';
  let row = tbody.insertRow(0);
  let cell = row.insertCell();
  cell.innerHTML = median.toString();
}
