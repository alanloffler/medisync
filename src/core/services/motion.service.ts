import { DynamicAnimationOptions, Easing, ObjectTarget, spring } from 'motion/react';

export class Motion {
  private _keyframes: ObjectTarget<any> = {};
  private _options: DynamicAnimationOptions = {};

  private _optionsMap = {
    bounce: { duration: 0.7, ease: 'linear' as Easing, type: spring, bounce: 0.7 },
    fly: { duration: 1, ease: 'linear' as Easing, type: spring, bounce: 0.5, repeat: Infinity, repeatDelay: 0.5 },
    linear: { duration: 0.7, ease: 'linear' as Easing, type: spring },
    'linear-1': { duration: 0.35, ease: 'linear' as Easing, type: spring },
  };

  public rotate(value: string) {
    this._keyframes = { rotate: value };
    return this;
  }

  public scale(value: number) {
    this._keyframes = { scale: value };
    return this;
  }

  public x(value: number) {
    this._keyframes = { x: value };
    return this;
  }

  public y(value: number) {
    this._keyframes = { y: value };
    return this;
  }

  public xy(x: number[] | number, y: number[] | number) {
    this._keyframes = { x: x, y: y };
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
