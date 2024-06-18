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
      timeRef.current = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    }
  };

  // Função para parar o cronômetro
  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timeRef.current);
    }
  };

  // Limpar o intervalo quando o componente é desmontado
  React.useEffect(() => {
    return () => clearInterval(timeRef.current);
  }, []);

  React.useEffect(() => {
    setToPay(price * timeElapsed / 3600);
    console.log(price * timeElapsed / 3600);
  }, [timeElapsed]);

  // Função para formatar o tempo decorrido
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
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
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '10em' }}>
        {formatTime(timeElapsed)}
      </div>
    </div>
  );
}

export default App;
