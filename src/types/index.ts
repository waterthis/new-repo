import { Scenes, Context } from "telegraf";

export interface MyWizardSession extends Scenes.WizardSessionData {
  allNews: any;
  user_location: any;
  user_selection:any;
  current_index: number;
}

export interface MySession extends Scenes.WizardSession<MyWizardSession> {
  allNews: any;
  user_location: any;
  user_selection:any;
  current_index: number;
}

export interface MyContext extends Context {
  myContextProp: string;
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext, MyWizardSession>;
  wizard: Scenes.WizardContextWizard<MyContext>;
}


