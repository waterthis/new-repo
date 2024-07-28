import { WizardScene } from "telegraf/scenes";
import axios from "axios";
import { MyContext } from "../types";

const STEP_1 = async (ctx:MyContext) => {
  if (ctx.message && 'text' in ctx.message) {
    let input = ctx.message.text;
    let inputArray = input.split(" ");

    if (inputArray.length === 1) {
      ctx.reply("Please enter a correct country name");
      return ctx.wizard.next();
    } else if (inputArray.length > 1) {
      inputArray.shift();
      try {
        axios
          .get(process.env.COUNTRIES_API + inputArray.join(" ").toLowerCase())
          .then(function (response) {
            const country = response.data[0];
            const resMsg = `
            Common name : ${country.name.common}. 
  Official name : ${country.name.official}.
  Capital city : ${country.capital[0]}.
  Alternate spellings: ${country.altSpellings.join(", ")}.
  Located in ${country.subregion}, ${country.region}.
  ${
    country.landlocked
      ? "The country is landlocked (Has no direct access to the ocean)"
      : "The country is coastal (Has direct access to an ocean or sea)"
  }.
  Flag: ${country.flag}
  Population : ${country.population}
  ${country.timezones.length === 1 ? "Timezone" : "Timezones"} : ${
              country.timezones
            }
  `;
            ctx.reply(resMsg);
  
            const capitalLocation = ctx.replyWithLocation(
              country.capitalInfo.latlng[0],
              country.capitalInfo.latlng[1]
            );
  
            capitalLocation.then((msg) => {
              ctx.reply("Capital's Location");
            });
          })
          .catch(function (error) {
            // handle error
            console.log("Something went wrong");
            console.log(error);
            ctx.reply("Something went wrong.");
            ctx.reply("Can't find the country.");
          });
      } catch (error) {
        console.log(error);
      }
      return ctx.scene.leave();
    }
    console.log(input);
  } else {
    await ctx.reply("Something went wrong try again 🤗.");
    console.log("Message does not contain text");
    return ctx.scene.leave();
  }
};
const STEP_2 = async (ctx:MyContext) => {
  if (ctx.message && 'text' in ctx.message) {

  if (ctx.updateType !== "message" || ctx.message.text === undefined) {
    await ctx.reply("Invalid entry. Please send country name as Text.");
    return;
  }
  if (ctx.updateType !== "message" || ctx.message.text === undefined) {
    await ctx.reply("Invalid entry. Please send country name as Text.");
    return;
  }

  let input = ctx.message.text;
  let inputArray = input.split(" ");

  const query = ctx.message.text;

  try {
    const response = await axios(
      process.env.COUNTRIES_API + query.toLowerCase()
    );
    const country = response.data[0];
    const resMsg = `
Common name : ${country.name.common}. 
Official name : ${country.name.official}.
Capital city : ${country.capital[0]}.
Alternate spellings: ${country.altSpellings.join(", ")}.
Located in ${country.subregion}, ${country.region}.
${
  country.landlocked
    ? "The country is landlocked (Has no direct access to the ocean)"
    : "The country is coastal (Has direct access to an ocean or sea)"
}.
Flag: ${country.flag}
Population : ${country.population}
${country.timezones.length === 1 ? "Timezone" : "Timezones"} : ${
      country.timezones
    }
  `;

    ctx.reply(resMsg);
    const capitalLocation = ctx.replyWithLocation(
      country.capitalInfo.latlng[0],
      country.capitalInfo.latlng[1]
    );

    capitalLocation.then((msg) => {
      ctx.reply("Capital's Location");
    });
  } catch (error:any) {
    await ctx.reply("Something went wrong try again.");
    console.log("Something went wrong. Try Again 🤗");
    console.log(error.message);
  }
  return ctx.scene.leave();
}
else {
  await ctx.reply("Something went wrong try again 🤗.");
  console.log("Message does not contain text");
  return ctx.scene.leave();
}
};

const countryWizard = new WizardScene("COUNTRY_WIZARD", STEP_1, STEP_2);

export {countryWizard};
