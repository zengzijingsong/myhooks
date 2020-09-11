import React from "react";
import ReactDOM from "react-dom";

let memoizedState = [];
let currentCursor = 0;

function useState(initVal) {
  memoizedState[currentCursor] = memoizedState[currentCursor] || initVal;
  const cursor = currentCursor;
  function setVal(newVal) {
    console.log(cursor);
    memoizedState[cursor] = newVal;
    render();
  }
  // 返回state 然后 currentCursor+1
  return [memoizedState[currentCursor++], setVal];
}
function useEffect(fn, watch) {
  const hasWatchChange = memoizedState[currentCursor]
    ? !watch.every((val, i) => val === memoizedState[currentCursor][i])
    : true;
  if (hasWatchChange) {
    fn();
    memoizedState[currentCursor] = watch;
    currentCursor++; // 累加 currentCursor
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(1);

  useEffect(() => {
    console.log(`count:update--${count}`);
  }, [count]);
  useEffect(() => {
    console.log(`data:update--${data}`);
  }, [data]);

  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >{`当前点击次数：${count}`}</button>
      <button
        onClick={() => {
          setData(data + 2);
        }}
      >{`当前点击次数+2：${data}`}</button>
    </div>
  );
}
render(); // 首次渲染
function render() {
  console.log(memoizedState); // 执行hook后 数组的变化
  currentCursor = 0; // 重新render时需要设置为 0
  ReactDOM.render(<App />, document.getElementById("root"));
}
