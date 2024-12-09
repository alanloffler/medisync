import { DynamicAnimationOptions, Easing, ObjectTarget, spring } from 'motion/react';

export class Motion {
  private _keyframes: ObjectTarget<any> = {};
  private _options: DynamicAnimationOptions = {};

  private _optionsMap = {
    bounce: { duration: 0.7, ease: 'linear' as Easing, type: spring, bounce: 0.7 },
    linear: { duration: 0.7, ease: 'linear' as Easing, type: spring },
  };

  public x(value: number) {
    this._keyframes = { x: value };
    return this;
  }

  public type(type: keyof typeof this._optionsMap) {
    this._options = this._optionsMap[type];
    return this;
  }

  public animate() {
    const keyframes = this._keyframes;
    const options = this._options;

    return { keyframes, options };
  }
}

export const motion = new Motion();
