/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { compose, ifCondition } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';

export class AutosaveMonitor extends Component {
  componentDidUpdate (prevProps) {
    const { isDirty, isAutosaveable } = this.props;

    if (
      prevProps.isDirty !== isDirty ||
			prevProps.isAutosaveable !== isAutosaveable
    ) {
      this.toggleTimer(isDirty && isAutosaveable);
    }
  }

  componentWillUnmount () {
    this.toggleTimer(false);
  }

  toggleTimer (isPendingSave) {
    clearTimeout(this.pendingSave);
    const { autosaveInterval } = this.props;
    if (isPendingSave) {
      this.pendingSave = setTimeout(
        () => this.props.autosave(),
        autosaveInterval * 1000
      );
    }
  }

  render () {
    return null;
  }
}

export default compose([
  withSelect(select => {
    const {
      isEditedPostDirty,
      isEditedPostAutosaveable,
      getEditorSettings,
    } = select('core/editor');
    const { autosaveInterval, canSave, canAutosave } = getEditorSettings();
    return {
      isDirty: isEditedPostDirty(),
      isAutosaveable: isEditedPostAutosaveable(),
      autosaveInterval,
      // GUTENBERG JS
      canSave,
      canAutosave,
    };
  }),
  withDispatch(dispatch => ({
    autosave: dispatch('core/editor').autosave,
  })),
  // GUTENBERG JS
  // added the ifCondition to enable/disable
  // the autoave feature according 'canSave' and 'canAutosave' settings
  ifCondition(({ canSave, canAutosave }) => canSave && canAutosave),
])(AutosaveMonitor);
