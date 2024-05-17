
interface StepData {
  text: string;
  icon: JSX.Element;
}

interface ProgressStepperProps {
  type: 'chips' | 'onlyIcon' | 'iconText' | 'numberText' | 'onlyNumber';
  steps: Array<StepData>;
  progress: number;
}

export function ProgressStepper({
  type,
  steps,
  progress,
}: ProgressStepperProps) {
  return (
    <div
      className={`flex items-center relative ${
        type === 'iconText' || type === 'numberText'
          ? 'space-x-3'
          : 'justify-between w-full'
      } ${type === 'onlyIcon' || type === 'onlyNumber' ? 'px-4' : ''}`}
    >
      <div
        className={`absolute left-0 right-0 h-2 bg-gray-200 rounded ${
          type === 'onlyIcon' || type === 'onlyNumber' ? 'visible' : 'hidden'
        } ${
          type === 'chips' ? 'z-10' : 'z-0'
        } top-1/2 transform -translate-y-1/2`}
      />

      {steps.map((step, index) => {
        const isComplete = progress > index || progress === steps.length;
        const isActive = progress === index && progress !== steps.length;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={`flex items-center space-x-3 bg-white z-20 text-gray-500 ${
              isComplete ? 'bg-gray-800' : isActive ? 'bg-white' : 'bg-gray-200'
            } `}
          >
            {(type === 'onlyIcon' || type === 'iconText') && (
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                  isComplete ? 'text-white' : 'text-gray-800'
                } ${
                  isComplete
                    ? 'bg-neutral-600'
                    : isActive
                    ? 'bg-white shadow-hover-primary'
                    : 'bg-gray-100 shadow-medium'
                }`}
              >
                {step.icon}
              </div>
            )}

            {(type === 'onlyNumber' || type === 'numberText') && (
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center body-extra-small-semibold ${
                  isComplete ? 'text-white' : 'text-gray-800'
                } ${
                  isActive
                    ? 'bg-white shadow-hover-primary'
                    : isComplete
                    ? 'bg-neutral-600'
                    : 'bg-gray-100 shadow-medium'
                }`}
              >
                {index + 1}
              </div>
            )}

            {(type === 'iconText' || type === 'numberText') && (
              <div className=" body-small-semibold bg-white">{step.text}</div>
            )}

            {type === 'chips' && (
              <>
                {isActive ? (
                  <div className="w-12 h-2 bg-white shadow-hover-primary rounded" />
                ) : isComplete ? (
                  <div className="w-12 h-2 bg-primary-600 rounded" />
                ) : (
                  <div className="w-12 h-2 bg-gray-100  rounded" />
                )}
              </>
            )}

            {!isLast && (type === 'iconText' || type === 'numberText') && (
              <div className="h-px w-8 bg-gray-200 rounded-full"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
