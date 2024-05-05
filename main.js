
var output = document.querySelector("#output");
var queueOutput = document.querySelector("#queueOutput");
var nodesLst = document.querySelector("#nodesLst");
var nodeval = document.querySelector("#nodeval");
var cnv = document.querySelector("#cnv");
var ctx = cnv.getContext("2d");
var lastX = cnv.width/2;
var lastY = 40;
var lastNode = null;
var firstNode = null;
var steps = [];


function traverseBFS() {
  if(firstNode == null) {
      alert("Nothing to traverse....");
      return;
  }
  output.innerText = "";
  var q = [];
  var qToPrint = [];
  var currNode = firstNode;
  q.push(currNode);
  qToPrint.push(currNode.getValue());
  var visited = {};
  var t = setInterval(function() {
      if(q.length == 0) {
          clearInterval(t);
      } else {
          var e = q[0];
          if(visited[e.getId()] == undefined) { 
              visited[e.getId()] = true;
              highlight(e, qToPrint);
          }
          var n = e.getAdjascents();
          for(itrIndx in n) {
              q.push(n[itrIndx]);
              qToPrint.push(n[itrIndx].getValue());
          }
          q.shift();
          qToPrint.shift();
      }
  }, 1200);
}

function highlight(e, qToPrint) {
  console.log(e.getValue());
  e.highlight();
  output.innerText += " " + e.getValue();
  queueOutput.innerText = JSON.stringify(qToPrint);
}

var nodesLst = document.querySelector("#nodesLst");
var nodeval = document.querySelector("#nodeval");
nodeval.addEventListener("keyup", function(e) {
  if(e.keyCode == 13) {
      addNodeWrapper();
  }
});

var lastX = cnv.width / 2;
var lastY = 40;
var lastNode = null;
var firstNode = null;

function addNodeWrapper() {
  if(String(nodeval.value).trim() == "") {
      alert("can't add node with empty content..");
      return;
  }
  if(isNaN(nodeval.value)) {
      alert("can't add node ndoe value '" + nodeval.value + "'. Only numbers allowed.");
      return;
  }
  var node = addNode(nodeval.value, lastNode);
  if(lastNode == null) {
      firstNode = node;
  }
  lastNode = node;
  var opt = createOption(nodesLst, nodeval.value);
  opt.value = node.getId();
  nodeval.value = '';
}

var steps = [];

function replaySteps() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  lastX = cnv.width / 2;
  lastY = 40;
  nodesMap = {};
  xDir = -1;
  yDir = 1;
  var stepIndx = 0;
  var t = setInterval(function() {
      if(stepIndx < steps.length) {
          var step = steps[stepIndx];
          step[0].show();
          step[0].mapAdjascents();
          stepIndx++;
      } else {
          clearInterval(t);
      }
  }, 100);
}

function addNode(val, adjascentNode) {
  var node = new Node(val);
  steps.push([node, node.getValue()]);
  node.show();
  if(adjascentNode != null) {
      adjascentNode.addAdjascent(node);
  }
  return node;
}

function addAdjascentToNodeWrapper() {
  if(nodesLst.value == '') {
      alert("Can add adjascent to empty value");
      return;
  }
  var node = addAdjascentToNode(nodesLst.value, nodeval.value);
  lastNode = node;
}

function addAdjascentToNode(adjascentNodeId, val) {
  var selectedNode = nodesMap[adjascentNodeId];
  var node = addNode(val, selectedNode);
  return node;
}

function createOption(selectElem, optionText) {
  var option = document.createElement("option");
  option.innerText = optionText;
  selectElem.appendChild(option);
  return option;
}

var nodesMap = {};
var xDir = -1;
var yDir = 1;
var CNVPAD = 50;

function Node(val) {
  var ret = {};
  var x = lastX;
  var y = lastY;
  var id = uuidv4();
  nodesMap[id] = ret;
  lastX += xDir * 30;
  lastY += yDir * 30;
  if(lastX < CNVPAD) {
      xDir = 1;
  } else if(lastX > cnv.width - CNVPAD) {
      xDir = -1;
  }
  if(lastY > cnv.height - CNVPAD) {
      yDir = -1;
  } else if(lastY < CNVPAD) {
      yDir = 1;
  }
  var adjascents = [];
  ret.getValue = () => {
      return val
  };
  ret.addAdjascent = (adjNode) => {
      adjascents.push(adjNode);
      mapNode1toNode2(ret, adjNode);
  };
  ret.mapAdjascents = () => {
      for(var i = 0; i < adjascents.length; i++) {
          mapNode1toNode2(ret, adjascents[i]);
      }
  };
  ret.getAdjascents = () => {
      return adjascents
  };
  ret.getX = function() {
      return x;
  }
  ret.getY = function() {
      return y;
  }
  ret.getId = function() {
      return id;
  }
  ret.show = function() {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(val, x - 20, y);
      ctx.stroke();
  };
  ret.highlight = function() {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.stroke();
  }
  return ret;
}

function mapNode1toNode2(node1, node2) {
  ctx.beginPath();
  ctx.moveTo(node1.getX(), node1.getY());
  ctx.lineTo(node2.getX(), node2.getY());
  ctx.stroke();
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
