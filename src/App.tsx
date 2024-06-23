import React from 'react';
import 'primereact/resources/themes/md-dark-indigo/theme.css';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';


function App() {
  const [price, setPrice] = React.useState(0);
  const [toPay, setToPay] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeElapsed, setTimeElapsed] = React.useState<number>(0);
  const timeRef = React.useRef<NodeJS.Timeout | number | undefined>(undefined);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      localStorage.setItem('isRunning', '1');
      localStorage.setItem('startTime', Date.now().toString());
      timeRef.current = setInterval(intervalFunction, 1000);
    }
  };

  // Função para parar o cronômetro
  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timeRef.current);
      localStorage.setItem('isRunning', '0');
      localStorage.removeItem('startTime');
    }
  };

  const clearTimer = () => {
    stopTimer();
    setTimeElapsed(0);
  };

  const intervalFunction = () => {
    let startTimeLocalStorage = localStorage.getItem('startTime');
    let isRunningLocalStorage = localStorage.getItem('isRunning');
    setIsRunning(isRunningLocalStorage === '1');
    if (isRunningLocalStorage === '1' && startTimeLocalStorage) {
      let startTime = Number(startTimeLocalStorage);
      setTimeElapsed((Date.now() - startTime) / 1000);
    }
  }

  // Limpar o intervalo quando o componente é desmontado
  React.useEffect(() => {
    timeRef.current = setInterval(intervalFunction, 1000);
    return () => clearInterval(timeRef.current);
  }, []);

  React.useEffect(() => {
    setToPay(price * timeElapsed / 3600);
  }, [timeElapsed]);

  // Função para formatar o tempo decorrido
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.ceil(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  return (
    <div className="App" style={{padding: '1rem'}}>
      <header className="App-header" style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', minHeight: '2rem' }}>
      <div className="p-inputgroup" style={{flex: .2}}>
        <span className="p-inputgroup-addon">$</span>
        <InputNumber placeholder="Price" value={price} onValueChange={(e) => setPrice(e.value || 0)} style={{textAlign: 'end'}} />
        <span className="p-inputgroup-addon">.00</span>
      </div>
      </header>
      <div className="p-inputgroup" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <Button label="Start" onClick={startTimer} className='p-button-success p-button-outlined flex-1'/>
        <span className="p-inputgroup-addon">Valor total: {formatCurrency(toPay)}</span>
        <Button label="Stop" onClick={stopTimer} className='p-button-danger p-button-outlined flex-1'/>
        <Button label="Clear" onClick={clearTimer} disabled={isRunning} className='p-button-info p-button-outlined flex-1'/>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '10em' }}>
        {formatTime(timeElapsed)}
      </div>
    </div>
  );
}

export default App;
