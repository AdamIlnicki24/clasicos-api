import { DEFENDERS_LENGTH, FORWARDS_LENGTH, GOALKEEPERS_LENGTH, MIDFIELDERS_LENGTH } from "./lengths";

export const EXISTING_USER_EXCEPTION = "Użytkownik o podanym adresie e-mail już istnieje.";
export const EXISTING_PLAYER_EXCEPTION = "Ten piłkarz już istnieje.";
export const PLAYER_NOT_FOUND_EXCEPTION = "Wybrany gracz nie istnieje.";
export const COMMENT_NOT_FOUND_EXCEPTION = "Nie znaleziono komentarza.";
export const EXISTING_TEAM_EXCEPTION = "Stworzyłeś już swoją drużynę. Możesz ją edytować lub usunąć.";
export const INVALID_TEAM_EXCEPTION = `Drużyna musi zawierać dokładnie: ${GOALKEEPERS_LENGTH} bramkarza, ${DEFENDERS_LENGTH} obrońców, ${MIDFIELDERS_LENGTH} pomocników i ${FORWARDS_LENGTH} napastników.`;
export const TEAM_NOT_FOUND_EXCEPTION = "Nie znaleziono drużyny.";
export const USER_NOT_FOUND_EXCEPTION = "Nie znaleziono użytkownika.";
export const ADMIN_CANNOT_BE_BANNED_EXCEPTION = "Nie możesz zbanować administratora.";
export const USER_HAS_BEEN_BANNED_EXCEPTION = "Zostałeś zbanowany i nie możesz wykonać tej akcji.";
export const USER_NOT_LOGGED_IN_EXCEPTION = "Brak dostępu - musisz się zalogować.";