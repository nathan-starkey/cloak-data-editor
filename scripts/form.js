/**
 * Get the value of an element, respecting its type.
 * @param {HTMLElement} elem Any HTMLElement.
 * @returns {*} The element's value.
 */
function getElementValue(elem) {
  if (elem instanceof HTMLInputElement) {
    if (elem.type == "number") {
      return elem.valueAsNumber || 0;
    } else if (elem.type == "checkbox") {
      return elem.checked;
    } else {
      return elem.value;
    }
  } else if ("value" in elem) {
    return elem.value;
  } else {
    return undefined;
  }
}

/**
 * Set the value of an element, respecting its type.
 * @param {HTMLElement} elem Any HTMLElement.
 * @param {*} value Something to set as the value.
 */
function setElementValue(elem, value) {
  if (elem instanceof HTMLInputElement) {
    if (elem.type == "number") {
      elem.valueAsNumber = parseFloat(value) || 0;
    } else if (elem.type == "checkbox") {
      elem.checked = value;
    } else {
      elem.value = value ?? "";
    }
    return;
  } else if ("value" in elem) {
    elem.value = value;
  }
}

/**
 * Get the values of a form's named elements.
 * @param {HTMLFormElement} form Any HTMLFormElement.
 * @returns {Object.<string, *>} The values retrieved, indexed by their element's name.
 */
function getFormValues(form) {
  let values = {};

  for (let elem of form.elements) {
    if (elem.name) {
      values[elem.name] = getElementValue(elem);
    }
  }

  return values;
}

/**
 * Set the values of a form's named elements.
 * @param {HTMLFormElement} form Any HTMLFormElement.
 * @param {Object.<string, *>} values The values to set, indexed by their element's name.
 */
function setFormValues(form, values) {
  for (let elem of form.elements) {
    if (elem.name) {
      setElementValue(elem, values[elem.name]);
    }
  }
}