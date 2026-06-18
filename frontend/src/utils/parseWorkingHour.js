
function parseWorkingHour(slot) {

  const parts = slot.split(":");

  return {
    label: parts[0],
    value: parts.slice(1).join(":").trim()
  };

}

export default parseWorkingHour;