import React from 'react'
import { SpinWheel, type ISpinWheelProps } from 'spin-wheel-game';

const segments = [
  { segmentText: 'Option 1', segColor: 'red' },
  { segmentText: 'Option 2', segColor: 'blue' },
  { segmentText: 'Option 3', segColor: 'green' },
  // Add more segments as needed
];

const SpinWheels : React.FC = () => {
  const spinWheelProps: ISpinWheelProps = {
    segments,
    onFinished: ()=>console.log("findished"),
    primaryColor: 'black',
    contrastColor: 'white',
    buttonText: 'Spin',
    isOnlyOnce: false,
    size: 290,
    upDuration: 100,
    downDuration: 600,
    fontFamily: 'Arial',
    arrowLocation: 'top',
    showTextOnSpin: true,
    isSpinSound: true,
  };

  return (
    <SpinWheel {...spinWheelProps} />
  )
}

export default SpinWheels