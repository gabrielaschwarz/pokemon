const puppeteer = require('puppeteer');
const readline = require('readline');
const figlet = require('figlet');
const chalk = require('chalk');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getInfo(nome) {

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {

    await page.goto('https://pokemon.fandom.com/pt-br/wiki/Pokédex_Nacional', { waitUntil: 'networkidle0' });

    console.log(`Buscando informações de ${nome}...`);

    const pokemonInfo = await page.evaluate((nome) => {
      const elementSelector = `a[title="${nome}"]:not(:has(img))`;
      const child = document.querySelector(elementSelector);
      if (!child) return;
      const parent = child.parentNode.parentElement;
      return parent.innerText;
    }, nome);
    // console.log(parentContent);
    return pokemonInfo;

  } catch (error) {
    console.error('Ocorreu um erro ao buscar informações:', error);
    return;
  } finally {
    await browser.close();
  }
}


async function main() {

  console.log(chalk.red(figlet.textSync("POKEDEX", {
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  }))
  );

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  rl.question('Digite o nome do Pokémon: ', async (nome) => {
    nome = capitalize(nome);
    const pokemon = await getInfo(nome);

    if (!pokemon) {
      console.log(`Não foi possível encontrar informações de tipos para o Pokémon ${nome}.`);
      process.exit(1);
    }

    console.log(pokemon);

    rl.close();
  });
}

main();