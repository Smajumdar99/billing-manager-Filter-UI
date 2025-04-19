import { FC } from 'react';
import { ActiveDirectivesWidget } from './ActiveDirectivesWidget/active-directives-widget';
import { CognitiveStatusWidget } from './CognitiveStatusWidget/cognitive-status-widget';
import { FunctionalStatusWidget } from './FunctionalStatusWidget/functional-status-widget';
import type { WidgetType } from '@/types/widget';

export const widgetComponents: Record<WidgetType, FC<any>> = {
  active_directives: ActiveDirectivesWidget,
  cognitive_status: CognitiveStatusWidget,
  functional_status: FunctionalStatusWidget,
  // Add other widgets as needed
} as Record<WidgetType, FC<any>>; 