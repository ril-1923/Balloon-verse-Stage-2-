export type BalloonPattern = 'solid' | 'vertical' | 'horizontal' | 'alternating';
export type BasketStyle = 'lightWicker' | 'darkWicker' | 'premium';

export interface BalloonConfig {
  name: string;
  colors: string[];
  pattern: BalloonPattern;
  basket: BasketStyle;
}

export const DEFAULT_BALLOON: BalloonConfig = {
  name: 'Sunrise Gold',
  colors: ['#f6b73c', '#e8590c', '#fff1d0'],
  pattern: 'vertical',
  basket: 'lightWicker',
};
