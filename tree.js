DrawGrid();

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.node_color = purple;
    this.left_color = black;
    this.right_color = black;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class State {
  constructor(node_array, step_message) {
    this.node_array = node_array;
    this.step_message = step_message;
  }
}

let state_array = [];
let node_array = [];
let cur_tree = [];

let current_message = "";
let current_state = 0;
let pause = 0;

let merge_plan =
  "Merge algorithm plan: Let's say we merge trees calles left and right. \n 0. If left or right tree is empty - return empty tree. \n 1. Assign new root a node with higher priority. \n 2. \n a) If new root is left - merge recursively left->right_subtree and right. Assign the result to left->right_subtree. \n b) If new root is right - merge recursively left and right->left_subtree. Assign the result to right->left_subtree.";
let split_plan =
  "Split algorithm plan: Let's say we split tree with given root by split_key. \n 0. If root is empty - return two empty trees. \n 1. \n a) If root->key <= split_key then recursively split root->right_subtree by split_key, assign left tree of result to root->right_subtree and return root and right part of the result as a new result. \n b) If root->key > split_key then recursively split root->left_subtree by split_key, assign right tree of result to root->left_subtree and return left part of the result and root as a new result.";
let insert_plan =
  "Insert algorithm plan: Let's say we insert node (x;y) in tree with given root. \n 1. Split root by key x. Let's name two trees in split result as left and right. \n 2. Merge left and node (x;y). \n 3. Merge result of previous step with right. ";
let delete_plan =
  "Delete algorithm plan: Let's say we delete node (x;y) from tree with given root. \n 1. Split root by key x. Let's name two trees in split result as left and right. \n 2. Split left by key x-1. Right part of the result will be the node (x;y), delete it. \n 3. Merge left part of the left tree in previous step with right in the first step.";

function DrawTree() {
  ShowStepMessage();
  for (let i = 0; i < node_array.length; ++i) {
    ShowStepMessage();
    DrawNode(node_array[i].x, node_array[i].y, node_array[i].node_color);
    if (node_array[i].left !== null) {
      DrawEdge(
        node_array[i].x,
        node_array[i].y,
        node_array[i].left.x,
        node_array[i].left.y,
        node_array[i].left_color
      );
    }
    if (node_array[i].right !== null) {
      DrawEdge(
        node_array[i].x,
        node_array[i].y,
        node_array[i].right.x,
        node_array[i].right.y,
        node_array[i].right_color
      );
    }
  }
}

function UndrawTree() {
  for (let i = 0; i < node_array.length; ++i) {
    UndrawNode(node_array[i].x, node_array[i].y, node_array[i].node_color);
    if (node_array[i].left !== null) {
      UndrawEdge(
        node_array[i].x,
        node_array[i].y,
        node_array[i].left.x,
        node_array[i].left.y,
        node_array[i].left_color
      );
    }
    if (node_array[i].right !== null) {
      UndrawEdge(
        node_array[i].x,
        node_array[i].y,
        node_array[i].right.x,
        node_array[i].right.y,
        node_array[i].right_color
      );
    }
  }
}

function Wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function CopyState() {
  copyArray = [];
  for (let i = 0; i < node_array.length; ++i) {
    tmp = new Node(0, 0);
    Object.assign(tmp, node_array[i]);
    copyArray.push(tmp);
  }
  for (let i = 0; i < copyArray.length; ++i) {
    if (copyArray[i].left !== null) {
      for (let j = 0; j < copyArray.length; ++j) {
        if (copyArray[i].left.x === copyArray[j].x) {
          copyArray[i].left = copyArray[j];
          break;
        }
      }
    }
    if (copyArray[i].right !== null) {
      for (let j = 0; j < copyArray.length; ++j) {
        if (copyArray[i].right.x === copyArray[j].x) {
          copyArray[i].right = copyArray[j];
          break;
        }
      }
    }
  }
  state_array.push(new State(copyArray, current_message));
}

function Merge(a, b) {
  if (a !== null) {
    a.node_color = green;
  }
  if (b !== null) {
    b.node_color = green;
  }
  if (a !== null && b !== null) {
    current_message =
      "Current step: " +
      "Merging recursively (" +
      a.x +
      ";" +
      a.y +
      ") and " +
      "(" +
      b.x +
      ";" +
      b.y +
      ").";
  } else if (a === null) {
    current_message =
      "Current step: " +
      "Merging (" +
      b.x +
      ";" +
      b.y +
      ")" +
      " with empty tree, returning from recursion base case.";
  } else if (b === null) {
    current_message =
      "Current step: " +
      "Merging (" +
      a.x +
      ";" +
      a.y +
      ")" +
      " with empty tree, returning from recursion base case.";
  } else {
    current_message =
      "Current step: " +
      "Merging empty trees, returning from recursion base case.";
  }
  CopyState();
  if (a === null) {
    if (b !== null) {
      b.node_color = orange;
    }
    return b;
  }
  if (b === null) {
    if (a !== null) {
      a.node_color = orange;
    }
    return a;
  }

  if (a.y >= b.y) {
    a.right_color = red;
    a.node_color = yellow;
    let result = Merge(a.right, b);
    a.right = result;
    current_message = "Current step: " + "Going back in recursion.";
    if (a.right !== null) {
      a.right.parent = a;
      current_message =
        "Current step: " +
        "Going back in recursion, adding new edge: (" +
        a.x +
        ";" +
        a.y +
        ") -> " +
        "(" +
        a.right.x +
        ";" +
        a.right.y +
        ").";
    }
    a.right_color = blue;
    CopyState();
    a.right_color = black;
    a.node_color = orange;
    return a;
  } else {
    b.left_color = red;
    b.node_color = yellow;
    let result = Merge(a, b.left);
    b.left = result;
    current_message = "Current step: " + "Going back in recursion";
    if (b.left !== null) {
      b.left.parent = b;
      current_message =
        "Current step: " +
        "Going back in recursion, adding new edge: (" +
        b.x +
        ";" +
        b.y +
        ") -> " +
        "(" +
        b.left.x +
        ";" +
        b.left.y +
        ").";
    }
    b.left_color = blue;
    CopyState();
    b.left_color = black;
    b.node_color = orange;
    return b;
  }
}

function Split(root, key) {
  if (root === null) {
    return { first: null, second: null };
  }
  root.node_color = green;
  current_message =
    "Current step: " +
    "Splitting recursively " +
    "(" +
    root.x +
    ";" +
    root.y +
    ").";
  CopyState();
  if (root.x <= key) {
    root.right_color = red;
    root.node_color = yellow;
    current_message =
      "Current step: " +
      "Root key is smaller than split key, so going recursively to right subtree.";
    CopyState();
    let was_null = root.right === null;
    let result = Split(root.right, key);
    if (root.right !== null) {
      root.right.parent = null;
    }
    root.right = result.first;
    root.right_color = blue;
    if (!was_null) {
      current_message = "Current step: " + "Going back in recursion";
      if (root.right !== null) {
        current_message =
          "Current step: " +
          "Going back in recursion, adding new edge: (" +
          root.x +
          ";" +
          root.y +
          ") -> " +
          "(" +
          root.right.x +
          ";" +
          root.right.y +
          ").";
      }
      CopyState();
    }
    root.right_color = black;
    root.node_color = orange;
    if (root.right !== null) {
      root.right.parent = root;
    }
    return { first: root, second: result.second };
  } else {
    root.left_color = red;
    root.node_color = yellow;
    current_message =
      "Current step: " +
      "Root key is bigger than split key, so going recursively to left subtree.";
    CopyState();
    let result = Split(root.left, key);
    let was_null = root.left === null;
    if (root.left !== null) {
      root.left.parent = null;
    }
    root.left = result.second;
    root.left_color = blue;
    if (!was_null) {
      current_message = "Current step: " + "Going back in recursion";
      if (root.left !== null) {
        current_message =
          "Current step: " +
          "Going back in recursion, adding new edge: (" +
          root.x +
          ";" +
          root.y +
          ") -> " +
          "(" +
          root.left.x +
          ";" +
          root.left.y +
          ").";
      }
      CopyState();
    }
    root.left_color = black;
    root.node_color = orange;
    if (root.left !== null) {
      root.left.parent = root;
    }
    return { first: result.first, second: root };
  }
}

function ShowStepMessage() {
  document.getElementById("step-window").innerHTML = current_message;
}

function ShowAlgorithmPlan(algorithm_plan) {
  document.getElementById("algorithm-window").innerHTML = algorithm_plan;
}

function ErrorHandler(error) {
  document.getElementById("error-window").innerHTML = "Error: " + error;
}

function EnabledShowSteps() {
  var checkbox = document.getElementById("tick");
  return checkbox.checked;
}

async function PlayButton() {
  ErrorHandler("");
  if (state_array.length === 0) {
    return;
  }
  pause = 0;
  for (let i = current_state; i < state_array.length; ++i) {
    if (pause) {
      break;
    }
    current_state = i;
    UndrawTree();
    node_array = state_array[i].node_array;
    current_message = state_array[i].step_message;
    DrawTree();
    await Wait(1500);
  }
}

async function PauseButton() {
  ErrorHandler("");
  if (state_array.length === 0) {
    return;
  }
  PauseHandler();
}

async function PauseHandler() {
  pause = 1;
  await Wait(1700);
}

async function NextStepButton() {
  ErrorHandler("");
  if (state_array.length === 0) {
    return;
  }
  PauseHandler();
  if (current_state + 1 < state_array.length) {
    ++current_state;
  }
  UndrawTree();
  node_array = state_array[current_state].node_array;
  current_message = state_array[current_state].step_message;
  DrawTree();
}

async function PrevStepButton() {
  ErrorHandler("");
  if (state_array.length === 0) {
    return;
  }
  PauseHandler();
  if (current_state - 1 >= 0) {
    --current_state;
  }
  UndrawTree();
  node_array = state_array[current_state].node_array;
  current_message = state_array[current_state].step_message;
  DrawTree();
}

function GoToLastStep() {
  pause = 1;
  if (state_array.length > 0) {
    UndrawTree();
    node_array = state_array[state_array.length - 1].node_array;
    current_message = state_array[state_array.length - 1].step_message;
    DrawTree();
    state_array = [];
    return true;
  }
  return false;
}

async function BuildInsertButton() {
  ErrorHandler("");
  GoToLastStep();
  let key = Number(document.getElementById("build-key").value);
  let priority = Number(document.getElementById("build-priority").value);
  if (isNaN(key) || isNaN(priority) || key % 1 != 0 || priority % 1 != 0) {
    ErrorHandler("Key/Priority is not an integer");
    return;
  }
  if (
    key < 1 ||
    key > grid_cell_width ||
    priority < 1 ||
    priority > grid_cell_height
  ) {
    ErrorHandler("Key/Priority is out of range");
    return;
  }
  let node = new Node(key, priority);
  for (let i = 0; i < node_array.length; ++i) {
    if (node_array[i].x === key) {
      ErrorHandler("Node with the same Key already exists");
      return;
    }
  }
  UndrawTree();
  node.node_color = blue;
  cur_tree.push(node);
  node_array.push(node);
  DrawTree();
}

async function BuildDeleteButton() {
  ErrorHandler("");
  GoToLastStep();
  let key = Number(document.getElementById("build-key").value);
  let priority = Number(document.getElementById("build-priority").value);
  if (isNaN(key) || isNaN(priority) || key % 1 != 0 || priority % 1 != 0) {
    ErrorHandler("Key/Priority is not an integer");
    return;
  }
  if (
    key < 1 ||
    key > grid_cell_width ||
    priority < 1 ||
    priority > grid_cell_height
  ) {
    ErrorHandler("Key/Priority is out of range");
    return;
  }
  let node = new Node(key, priority);
  for (let i = 0; i < cur_tree.length; ++i) {
    if (cur_tree[i].x === key && cur_tree[i].y === priority) {
      cur_tree.splice(i, 1);
      for (let j = 0; j < node_array.length; ++j) {
        if (node_array[j].x === key && node_array[j].y === priority) {
          UndrawTree();
          node_array.splice(j, 1);
          DrawTree();
          return;
        }
      }
    }
  }
  ErrorHandler(
    "Node with such Key and Priority doesn't exits in current build operation"
  );
}

function BuildTree(array) {
  let max_y = -1;
  let max_index = -1;
  for (let i = 0; i < array.length; ++i) {
    if (array[i].y > max_y) {
      max_y = array[i].y;
      max_index = i;
    }
  }
  if (max_index === -1) {
    return null;
  }
  array[max_index].right = BuildTree(array.slice(max_index + 1));
  array[max_index].left = BuildTree(array.slice(0, max_index));
  if (array[max_index].right !== null) {
    array[max_index].right.parent = array[max_index];
  }
  if (array[max_index].left !== null) {
    array[max_index].left.parent = array[max_index];
  }
  return array[max_index];
}

async function BuildButton() {
  ErrorHandler("");
  GoToLastStep();
  UndrawTree();
  cur_tree.sort((a, b) => a.x - b.x);
  for (let i = 0; i < cur_tree.length; ++i) {
    for (let j = 0; j < node_array.length; ++j) {
      if (
        node_array[j].x === cur_tree[i].x &&
        node_array[j].y === cur_tree[i].y
      ) {
        node_array[j].node_color = purple;
      }
    }
  }
  BuildTree(cur_tree);
  cur_tree = [];
  DrawTree();
}

async function BuildClearButton() {
  ErrorHandler("");
  GoToLastStep();
  UndrawTree();
  for (let i = 0; i < cur_tree.length; ++i) {
    for (let j = 0; j < node_array.length; ++j) {
      if (
        node_array[j].x === cur_tree[i].x &&
        node_array[j].y === cur_tree[i].y
      ) {
        node_array.splice(j, 1);
      }
    }
  }
  cur_tree = [];
  DrawTree();
}

async function ClearAllButton() {
  current_message = "";
  ErrorHandler("");
  ShowStepMessage();
  ShowAlgorithmPlan("");
  GoToLastStep();
  UndrawTree();
  cur_tree.splice(0, cur_tree.length);
  node_array.splice(0, node_array.length);
  state_array.splice(0, state_array.length);
  DrawTree();
}

function GetMaxKey(node) {
  if (node === null) {
    return -1;
  }
  return Math.max(node.x, GetMaxKey(node.left), GetMaxKey(node.right));
}

function GetMinKey(node) {
  if (node === null) {
    return grid_cell_width + 1;
  }
  return Math.min(node.x, GetMinKey(node.left), GetMinKey(node.right));
}

async function MergeButton() {
  ErrorHandler("");
  ShowAlgorithmPlan(merge_plan);
  current_message = "Current step: " + "Starting merge operation.";
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  let key1 = Number(document.getElementById("merge-root-key-1").value);
  let key2 = Number(document.getElementById("merge-root-key-2").value);
  if (isNaN(key1) || isNaN(key2) || key1 % 1 != 0 || key2 % 1 != 0) {
    ErrorHandler("Left root key/Right root key is not an integer");
    return;
  }
  state_array = [];
  a = null;
  b = null;
  for (let i = 0; i < node_array.length; ++i) {
    if (node_array[i].x === key1) {
      a = node_array[i];
    }
    if (node_array[i].x === key2) {
      b = node_array[i];
    }
  }
  if (a === null || b === null) {
    ErrorHandler("No nodes this such keys!");
    return;
  }
  if (a.parent !== null || b.parent !== null) {
    ErrorHandler("Nodes should be roots!");
    return;
  }
  if (a === b) {
    ErrorHandler("Can't merge same trees!");
    return;
  }
  if (GetMaxKey(a) >= GetMinKey(b)) {
    ErrorHandler(
      "The first tree in merge should have keys less then every key in the second tree!"
    );
    return;
  }
  UndrawTree();
  Merge(a, b);
  current_message = "Current step: " + "Merge is done!";
  CopyState();
  for (let i = 0; i < node_array.length; ++i) {
    node_array[i].node_color = purple;
  }
  CopyState();
  if (EnabledShowSteps()) {
    current_state = 0;
    PlayButton();
  } else {
    current_state = state_array.length - 1;
    node_array = state_array[current_state].node_array;
    current_message = state_array[current_state].step_message;
    DrawTree();
  }
  return;
}

async function SplitButton() {
  ErrorHandler("");
  GoToLastStep();
  ShowAlgorithmPlan(split_plan);
  current_message = "Current step: " + "Starting split operation.";
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  let root_key = Number(document.getElementById("split-root-key").value);
  let split_key = Number(document.getElementById("split-key").value);
  if (
    isNaN(root_key) ||
    isNaN(split_key) ||
    root_key % 1 != 0 ||
    split_key % 1 != 0
  ) {
    ErrorHandler("Root key/Split key is not an integer");
    return;
  }
  state_array = [];
  root = null;
  for (let i = 0; i < node_array.length; ++i) {
    if (node_array[i].x === root_key) {
      root = node_array[i];
    }
  }
  if (root === null) {
    ErrorHandler("No root with such key!");
    return;
  }
  if (root.parent !== null) {
    ErrorHandler("Node should be root!");
    return;
  }
  UndrawTree();
  Split(root, split_key);
  current_message = "Current step: " + "Split is done!";
  CopyState();
  for (let i = 0; i < node_array.length; ++i) {
    node_array[i].node_color = purple;
  }
  CopyState();
  if (EnabledShowSteps()) {
    current_state = 0;
    PlayButton();
  } else {
    current_state = state_array.length - 1;
    node_array = state_array[current_state].node_array;
    current_message = state_array[current_state].current_message;
    DrawTree();
  }
  return;
}

async function InsertButton() {
  ErrorHandler("");
  GoToLastStep();
  ShowAlgorithmPlan(insert_plan);
  current_message = "Current step: " + "Starting insert operation.";
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  let key = Number(document.getElementById("insert-delete-key").value);
  let priority = Number(
    document.getElementById("insert-delete-priority").value
  );
  let root_key = Number(
    document.getElementById("insert-delete-root-key").value
  );
  if (
    isNaN(key) ||
    isNaN(priority) ||
    isNaN(root_key) ||
    key % 1 != 0 ||
    priority % 1 != 0 ||
    root_key % 1 != 0
  ) {
    ErrorHandler("Key/Priority/Root key is not an integer");
    return;
  }
  if (
    key < 1 ||
    key > grid_cell_width ||
    priority < 1 ||
    priority > grid_cell_height
  ) {
    ErrorHandler("Key/Priority is out of range");
    return;
  }
  for (let i = 0; i < node_array.length; ++i) {
    if (node_array[i].x === key) {
      ErrorHandler("Node with such key already exists!");
      return;
    }
  }
  state_array = [];
  root = null;
  for (let i = 0; i < node_array.length; ++i) {
    if (node_array[i].x === root_key) {
      root = node_array[i];
    }
  }
  if (root === null) {
    ErrorHandler("No root with such keys!");
    return;
  }
  if (root.parent !== null) {
    ErrorHandler("Node should be root!");
    return;
  }
  let node = new Node(key, priority);
  node.node_color = light_blue;
  UndrawTree();
  node_array.push(node);
  CopyState();
  let state_count = state_array.length;
  let split_result = Split(root, key);
  current_message = "Current step: " + "Split is done!";
  CopyState();
  if (split_result.first === null || split_result.second === null) {
    state_array.splice(state_count, state_array.length - state_count);
    for (let i = 0; i < node_array.length; ++i) {
      node_array[i].node_color = purple;
    }
  }
  if (split_result.first !== null) {
    node = Merge(split_result.first, node);
    current_message = "Current step: " + "Merge is done!";
    CopyState();
  }
  if (split_result.second !== null) {
    Merge(node, split_result.second);
    current_message = "Current step: " + "Merge is done!";
    CopyState();
  }
  for (let i = 0; i < node_array.length; ++i) {
    node_array[i].node_color = purple;
  }
  current_message = "Current step: " + "Insert is done!";
  CopyState();
  if (EnabledShowSteps()) {
    current_state = 0;
    PlayButton();
  } else {
    current_state = state_array.length - 1;
    node_array = state_array[current_state].node_array;
    current_message = state_array[current_state].step_message;
    DrawTree();
  }
  return;
}

async function DeleteButton() {
  ErrorHandler("");
  GoToLastStep();
  ShowAlgorithmPlan(delete_plan);
  current_message = "Current step: " + "Starting delete operation.";
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  let key = Number(document.getElementById("insert-delete-key").value);
  let priority = Number(
    document.getElementById("insert-delete-priority").value
  );
  let root_key = Number(
    document.getElementById("insert-delete-root-key").value
  );
  if (
    isNaN(key) ||
    isNaN(priority) ||
    isNaN(root_key) ||
    key % 1 != 0 ||
    priority % 1 != 0 ||
    root_key % 1 != 0
  ) {
    ErrorHandler("Key/Priority/Root key is not an integer");
    return;
  }
  if (
    key < 1 ||
    key > grid_cell_width ||
    priority < 1 ||
    priority > grid_cell_height
  ) {
    ErrorHandler("Key/Priority is out of range");
    return;
  }
  state_array = [];
  root = null;
  for (let i = 0; i < node_array.length; ++i) {
    if (node_array[i].x === root_key) {
      root = node_array[i];
    }
  }
  if (root === null) {
    ErrorHandler("No root with such key!");
    return;
  }
  if (root.parent !== null) {
    ErrorHandler("Node should be root!");
    return;
  }
  UndrawTree();
  CopyState();
  let state_count = state_array.length;
  let split_result = Split(root, key);
  current_message = "Current step: " + "Split is done!";
  CopyState();
  if (split_result.second === null) {
    state_array.splice(state_count, state_array.length - state_count);
    for (let i = 0; i < node_array.length; ++i) {
      node_array[i].node_color = purple;
    }
  }
  state_count = state_array.length;
  let second_split_result = Split(split_result.first, key - 1);
  current_message = "Current step: " + "Split is done!";
  CopyState();
  if (second_split_result.first === null) {
    state_array.splice(state_count, state_array.length - state_count);
    for (let i = 0; i < node_array.length; ++i) {
      node_array[i].node_color = purple;
    }
  }
  if (second_split_result.second === null) {
    Merge(second_split_result.first, split_result.second);
    state_array = [];
    for (let i = 0; i < node_array.length; ++i) {
      node_array[i].node_color = purple;
    }
    DrawTree();
    ErrorHandler("No node with such key and priority in this tree!");
    return;
  }
  if (
    second_split_result.second.x !== key ||
    second_split_result.second.y !== priority
  ) {
    second_split_result.first = Merge(
      second_split_result.first,
      second_split_result.second
    );
    Merge(second_split_result.first, split_result.second);
    state_array = [];
    for (let i = 0; i < node_array.length; ++i) {
      node_array[i].node_color = purple;
    }
    DrawTree();
    ErrorHandler("No node with such key and priority in this tree!");
    return;
  }
  for (let i = 0; i < node_array.length; ++i) {
    if (
      node_array[i].x === second_split_result.second.x &&
      node_array[i].y === second_split_result.second.y
    ) {
      node_array.splice(i, 1);
      break;
    }
  }
  let node_exists = second_split_result.second !== null;
  if (second_split_result.first !== null && split_result.second !== null) {
    Merge(second_split_result.first, split_result.second);
    current_message = "Current step: " + "Merge is done!";
    CopyState();
  }
  for (let i = 0; i < node_array.length; ++i) {
    node_array[i].node_color = purple;
  }
  current_message = "Current step: " + "Delete is done!";
  CopyState();
  if (!node_exists) {
    state_array = [];
    ErrorHandler("Node doesn't exist!");
    return;
  }
  if (EnabledShowSteps()) {
    current_state = 0;
    PlayButton();
  } else {
    current_state = state_array.length - 1;
    node_array = state_array[current_state].node_array;
    current_message = state_array[current_state].step_message;
    DrawTree();
  }
  return;
}

async function BuildRandomTreeButton() {
  ErrorHandler("");
  GoToLastStep();
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  let nodes_count = Number(document.getElementById("random-nodes-count").value);
  let randomness = Number(document.getElementById("tree-randomness").value);
  if (isNaN(nodes_count) || nodes_count % 1 != 0) {
    ErrorHandler("Nodes count in not an integer!");
    return;
  }
  if (nodes_count < 1) {
    ErrorHandler("Nodes count should be positive!");
  }
  possible_keys = [];
  possible_priorities = [];
  for (let priority = 1; priority <= grid_cell_height; ++priority) {
    possible_priorities.push(priority);
  }
  for (let key = 1; key <= grid_cell_width; ++key) {
    let is_possible_key = true;
    for (let i = 0; i < node_array.length; ++i) {
      if (node_array[i].x === key) {
        is_possible_key = false;
        break;
      }
    }
    if (is_possible_key) {
      possible_keys.push(key);
    }
  }
  if (possible_keys.length < nodes_count) {
    ErrorHandler("Nodes count is bigger than possible number of new keys!");
    return;
  }
  state_array = [];
  UndrawTree();
  let random_keys = [];
  let random_priorities = [];
  for (let i = 0; i < nodes_count; ++i) {
    let random_index = Math.floor(Math.random() * possible_keys.length);
    if (random_index >= possible_keys.length) {
      random_index = possible_keys.length - 1;
    }
    random_keys.push(possible_keys[random_index]);
    possible_keys.splice(random_index, 1);
    if (possible_priorities.length === 0) {
      let new_random_priority =
        Math.floor(Math.random() * grid_cell_height) + 1;
      if (new_random_priority >= grid_cell_height) {
        new_random_priority = grid_cell_height;
      }
      possible_priorities.push(new_random_priority);
    }
    let random_priority =
      Math.floor(Math.random() * possible_priorities.length) + 1;
    if (random_priority >= possible_priorities.length) {
      random_priority = possible_priorities.length - 1;
    }
    random_priorities.push(possible_priorities[random_priority]);
    possible_priorities.splice(random_priority, 1);
  }
  if (Math.random() >= 0.5) {
    random_priorities.sort((a, b) => a - b);
  } else {
    random_priorities.sort((a, b) => b - a);
  }
  random_keys.sort((a, b) => a - b);
  randomness = 100 * Math.sqrt(randomness / 100);
  for (let i = 0; i < random_priorities.length; ++i) {
    if (Math.floor(Math.random() * 100) < randomness) {
      let swap_index = Math.floor(Math.random() * (i + 1));
      if (swap_index > i) {
        swap_index = i;
      }
      [random_priorities[swap_index], random_priorities[i]] = [
        random_priorities[i],
        random_priorities[swap_index],
      ];
    }
  }
  for (let i = 0; i < random_keys.length; ++i) {
    let random_node = new Node(random_keys[i], random_priorities[i]);
    cur_tree.push(random_node);
    node_array.push(random_node);
  }
  cur_tree.sort((a, b) => a.x - b.x);
  BuildTree(cur_tree);
  cur_tree = [];
  DrawTree();
}

function GetCurTree(root) {
  if (root === null) {
    return;
  }
  cur_tree.push(root);
  GetCurTree(root.right);
  GetCurTree(root.left);
}

async function RerandomizePrioritiesButton() {
  ErrorHandler("");
  GoToLastStep();
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  let randomness = Number(document.getElementById("priority-randomness").value);
  UndrawTree();
  possible_priorities = [];
  for (let priority = 1; priority <= grid_cell_height; ++priority) {
    possible_priorities.push(priority);
  }
  let random_priorities = [];
  for (let i = 0; i < node_array.length; ++i) {
    if (possible_priorities.length === 0) {
      let new_random_priority =
        Math.floor(Math.random() * grid_cell_height) + 1;
      if (new_random_priority >= grid_cell_height) {
        new_random_priority = grid_cell_height;
      }
      possible_priorities.push(new_random_priority);
    }
    let random_priority =
      Math.floor(Math.random() * possible_priorities.length) + 1;
    if (random_priority >= possible_priorities.length) {
      random_priority = possible_priorities.length - 1;
    }
    random_priorities.push(possible_priorities[random_priority]);
    possible_priorities.splice(random_priority, 1);
  }
  if (Math.random() >= 0.5) {
    random_priorities.sort((a, b) => a - b);
  } else {
    random_priorities.sort((a, b) => b - a);
  }
  randomness = 100 * Math.sqrt(randomness / 100);
  for (let i = 0; i < random_priorities.length; ++i) {
    if (Math.floor(Math.random() * 100) < randomness) {
      let swap_index = Math.floor(Math.random() * (i + 1));
      if (swap_index > i) {
        swap_index = i;
      }
      [random_priorities[swap_index], random_priorities[i]] = [
        random_priorities[i],
        random_priorities[swap_index],
      ];
    }
  }

  node_array.sort((a, b) => a.x - b.x);

  for (let i = 0; i < node_array.length; ++i) {
    if (node_array[i].parent === null) {
      GetCurTree(node_array[i]);
      for (let j = 0; j < cur_tree.length; ++j) {
        cur_tree[j].left = null;
        cur_tree[j].right = null;
        cur_tree[j].parent = null;
        cur_tree[j].y = random_priorities[node_array.indexOf(cur_tree[j])];
      }
      cur_tree.sort((a, b) => a.x - b.x);
      BuildTree(cur_tree);
      cur_tree = [];
    }
  }
  DrawTree();
}

function AddCustomNode(x, y) {
  node = new Node(x, y);
  cur_tree.push(node);
  node_array.push(node);
}

async function SplitExample1Button() {
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  ClearAllButton();
  ShowAlgorithmPlan("Try split with root key 18 and split key 7!");
  AddCustomNode(18, 18);
  AddCustomNode(2, 16);
  AddCustomNode(17, 15);
  AddCustomNode(3, 13);
  AddCustomNode(15, 12);
  AddCustomNode(4, 9);
  AddCustomNode(12, 7);
  AddCustomNode(6, 4);
  AddCustomNode(11, 1);
  AddCustomNode(22, 13);
  AddCustomNode(20, 2);
  cur_tree.sort((a, b) => a.x - b.x);
  BuildTree(cur_tree);
  cur_tree = [];
  DrawTree();
}

async function SplitExample2Button() {
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  ClearAllButton();
  ShowAlgorithmPlan("Try split with root key 3 and split key 14!");
  AddCustomNode(3, 18);
  AddCustomNode(5, 16);
  AddCustomNode(8, 14);
  AddCustomNode(12, 12);
  AddCustomNode(20, 10);
  AddCustomNode(19, 8);
  AddCustomNode(17, 7);
  AddCustomNode(13, 6);
  AddCustomNode(16, 2);
  cur_tree.sort((a, b) => a.x - b.x);
  BuildTree(cur_tree);
  cur_tree = [];
  DrawTree();
}

async function MergeExample1Button() {
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  ClearAllButton();
  ShowAlgorithmPlan("Try merge with left root key 6 and right root key 15!");
  AddCustomNode(1, 6);
  AddCustomNode(2, 14);
  AddCustomNode(3, 10);
  AddCustomNode(6, 18);
  AddCustomNode(7, 6);
  AddCustomNode(8, 2);
  AddCustomNode(9, 15);
  AddCustomNode(10, 4);
  cur_tree.sort((a, b) => a.x - b.x);
  BuildTree(cur_tree);
  cur_tree = [];
  AddCustomNode(12, 10);
  AddCustomNode(13, 5);
  AddCustomNode(14, 13);
  AddCustomNode(15, 17);
  AddCustomNode(17, 12);
  AddCustomNode(19, 14);
  AddCustomNode(20, 2);
  AddCustomNode(21, 6);
  cur_tree.sort((a, b) => a.x - b.x);
  BuildTree(cur_tree);
  cur_tree = [];
  DrawTree();
}

async function MergeExample2Button() {
  if (cur_tree.length !== 0) {
    ErrorHandler(
      "Build operation is not finished! Use clear or build function to continue."
    );
    return;
  }
  ClearAllButton();
  ShowAlgorithmPlan("Try merge with left root key 2 and right root key 20!");
  AddCustomNode(2, 18);
  AddCustomNode(3, 14);
  AddCustomNode(5, 11);
  AddCustomNode(6, 4);
  AddCustomNode(7, 1);
  cur_tree.sort((a, b) => a.x - b.x);
  BuildTree(cur_tree);
  cur_tree = [];
  AddCustomNode(20, 17);
  AddCustomNode(19, 15);
  AddCustomNode(17, 12);
  AddCustomNode(14, 7);
  AddCustomNode(13, 2);
  cur_tree.sort((a, b) => a.x - b.x);
  BuildTree(cur_tree);
  cur_tree = [];
  DrawTree();
}
