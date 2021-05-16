"use strict";
const cardContainer = document.getElementById("root");

fetch("./assets/js/data.json")
  .then((response) => response.json())
  .then((data) => {
    const cardElements = data.map((userCard) => createUserCard(userCard));
    cardContainer.append(...cardElements);
  })
  .catch((error) => console.log(error));

function createUserCard(userCard) {
  //li.cardWrapper
  return createElement(
    "li",
    { classNames: ["cardWrapper"] },
    //article.cardContainer
    createElement(
      "article",
      { classNames: ["cardContainer"] },
      createImageWrapper(userCard),
      createContentWrapper(userCard)
    )
  );
}

function createCardImage(link) {
  //img.cardImage
  const img = createElement("img", {
    classNames: ["cardImage"],
  });
  img.src = link;
  img.hidden = true;
  loadImage(img).then(handleImageLoad).catch(handleImageError);
  return img;
}

function loadImage(img) {
  return new Promise((resolve, reject) => {
    img.addEventListener("load", () => {
      resolve(img);
    });
  });
}

function createImageWrapper({ firstName, lastName, profilePicture }) {
  //div.cardImageWrapper
  const imageWrapper = createElement(
    "div",
    { classNames: ["cardImageWrapper"] },
    //div.initials
    createElement(
      "div",
      { classNames: ["initials"] },
      document.createTextNode(firstName[0] + lastName[0] || "")
    ),
    createCardImage(profilePicture)
  );
  imageWrapper.style.backgroundColor = stringToColor(firstName || "");

  return imageWrapper;
}

function createContentWrapper({ firstName, lastName, contacts }) {
  //div.contentWrapper
  return createElement(
    "div",
    { classNames: ["contentWrapper"] },
    //h3.cardName
    createElement(
      "h3",
      { classNames: ["cardName"] },
      document.createTextNode(firstName || "")
    ),
    //p.cardLastName
    createElement(
      "p",
      { classNames: ["cardLastName"] },
      document.createTextNode(lastName || "")
    ),
    //h2.cardDescription
    createElement("h2", { classNames: ["cardDescription"] }, "ACTOR"),
    //p.cardText
    createElement(
      "p",
      { classNames: ["cardText"] },
      "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo."
    ),
    //div.cardSocialLinks
    createElement(
      "div",
      { classNames: ["cardSocialLinks"] },
      ...createLinks(contacts, SOCIAL_ICONS_MAP)
    )
  );
}

function createSocialLinks(contacts = [], social = {}) {
  const result = [];
  if (contacts.length === 0) return;
  for (const link of contacts) {
    const url = new URL(link);
    if (Object.keys(social).includes(url.host)) {
      result.push(createLinks(url));
    }
  }
  return result;
}

function createLinks(contacts) {
  return contacts.map((contact) => {
    const url = new URL(contact);
    return createElement("a", {
      attributes: { href: contact },
      classNames: [
        SOCIAL_ICONS_MAP.get(url.hostname) || "fa-adn",
        "fab",
        "socialLink",
      ],
    });
  });
}

/**
 *
 * @param {string} tagName
 * @param {object} options
 * @param {string[]} options.classNames - css classes
 * @param {object} options.handlers - event handlers
 * @param {object} options.attributes - attributes
 * @param  {...Node} children
 * @returns {HTMLElement}
 */
function createElement(
  tagName,
  { classNames = [], handlers = {}, attributes = {} } = {},
  ...children
) {
  const elem = document.createElement(tagName);
  elem.classList.add(...classNames);

  for (const [attrName, attrValue] of Object.entries(attributes)) {
    elem.setAttribute(attrName, attrValue);
  }

  for (const [eventType, eventHandler] of Object.entries(handlers)) {
    elem.addEventListener(eventType, eventHandler);
  }

  elem.append(...children);
  return elem;
}

/*
  EVENT HANDLERS
  */

function handleImageError(img) {
  img.remove();
}

function handleImageLoad(img) {
  img.hidden = false;
}

/*
  UTILS
*/

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}
