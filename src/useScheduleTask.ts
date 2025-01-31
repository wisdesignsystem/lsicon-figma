import { useState, useEffect, useRef } from "react";

function useScheduleTask(task: () => void) {
  const timer = useRef(null);
  const running = useRef(false);
  const [time, setTime] = useState(0);

  function run(delay: number) {
    running.current = true;
    setTime(delay);
  }

  function abort() {
    clean();
  }

  function clean() {
    running.current = false;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setTime(0);
  }

  function check() {
    if (time <= 0) {
      clean();
      task();
      return;
    }

    timer.current = setTimeout(() => {
      setTime(time - 1);
    }, 1000)
  }

  useEffect(() => {
    if (!running.current) {
      return;
    }

    check();
  }, [time])

  return { time, isSchedule: !!time, run, abort };
}

export default useScheduleTask;
