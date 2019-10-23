import * as Ajax from './Ajax';
import * as Events from './Events';
import * as FormValidation from './FormValidation';
import * as Images from './Images';
import * as MaterialDesign from './MaterialDesign';
import * as Menu from './Menu';
import * as Message from './Message';

// Bind to the global window object if it exists
if(typeof window !== 'undefined'){
  window.GCdocs = {
    Ajax,
    Events,
    FormValidation,
    MaterialDesign,
    Menu,
    Message
  }

  MaterialDesign.init();
  Events.initTogglers();
}