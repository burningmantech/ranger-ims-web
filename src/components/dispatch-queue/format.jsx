import Incident from "../../ims/model/Incident";

import {
  HighPriorityIcon,
  LowPriorityIcon,
  NormalPriorityIcon,
  SearchIcon,
  UnknownPriorityIcon,
} from "../icons";

export const formatPriority = (priority) => {
  switch (priority) {
    case 1:
    case 2:
      return <HighPriorityIcon />;
    case 3:
      return <NormalPriorityIcon />;
    case 4:
    case 5:
      return <LowPriorityIcon />;
    default:
      return <UnknownPriorityIcon />;
  }
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) {
    return "";
  }
  return dateTime.toFormat("ccc L/c HH:mm");
};

export const formatState = (state) => {
  try {
    return Incident.stateToName(state);
  } catch (e) {
    return state;
  }
};

export const formatAddress = (address, concentricStreets) => {
  const formatCoordinate = (c) => (c == null ? "-" : c.toString());
  const formatMinute = (m) => (m == null ? "-" : m.toString().padStart(2, "0"));

  if (address == null) {
    return address;
  }
  if (address.concentric || address.radialHour || address.radialMinute) {
    const concentric =
      concentricStreets == null
        ? null
        : concentricStreets.get(address.concentric);
    return (
      `${formatCoordinate(address.radialHour)}:` +
      `${formatMinute(address.radialMinute)}@` +
      `${formatCoordinate(concentric)}` +
      `${address.description ? ` (${address.description})` : ""}`
    );
  } else if (address.description) {
    return `(${address.description})`;
  } else {
    return null;
  }
};

export const formatLocation = (location, concentricStreets) => {
  if (location == null) {
    return location;
  }

  const addressText = formatAddress(location.address, concentricStreets);

  if (location.name == null) {
    if (addressText == null) {
      return null;
    } else {
      return addressText;
    }
  } else {
    if (addressText == null) {
      return location.name;
    } else {
      return `${location.name} @ ${addressText}`;
    }
  }
};

export const formatArrayOfStrings = (strings) => {
  if (!strings) {
    return "";
  }
  return strings.sort().join(", ");
};
