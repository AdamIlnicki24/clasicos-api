import {
  COMMENT_CONTENT_MAX_LENGTH,
  DEFENDERS_LENGTH,
  EMAIL_MAX_LENGTH,
  FAVORITE_CLUB_MAX_LENGTH,
  FAVORITE_FOOTBALLER_MAX_LENGTH,
  FORWARDS_LENGTH,
  GOALKEEPERS_LENGTH,
  MIDFIELDERS_LENGTH,
  NATIONALITY_CODE_LENGTH,
  NICK_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
} from "./lengths";

export const EXISTING_EMAIL_EXCEPTION = "Użytkownik o podanym adresie e-mail już istnieje.";
export const EXISTING_NICK_EXCEPTION = "Użytkownik o podanym nicku już istnieje.";
export const EXISTING_RECOMMENDATION_EXCEPTION = "Już zarekomendowałeś ten komentarz";
export const EXISTING_PLAYER_EXCEPTION = "Ten piłkarz już istnieje.";
export const PLAYER_NOT_FOUND_EXCEPTION = "Wybrany gracz nie istnieje.";
export const COMMENT_NOT_FOUND_EXCEPTION = "Nie znaleziono komentarza.";
export const EXISTING_TEAM_EXCEPTION = "Stworzyłeś już swoją drużynę. Możesz ją edytować lub usunąć.";
export const INVALID_TEAM_EXCEPTION = `Drużyna musi zawierać dokładnie: ${GOALKEEPERS_LENGTH} bramkarza, ${DEFENDERS_LENGTH} obrońców, ${MIDFIELDERS_LENGTH} pomocników i ${FORWARDS_LENGTH} napastników.`;
export const TEAM_NOT_FOUND_EXCEPTION = "Nie znaleziono drużyny.";
export const USER_NOT_FOUND_EXCEPTION = "Nie znaleziono użytkownika.";
export const RECOMMENDATION_NOT_FOUND_EXCEPTION = "Nie znaleziono rekomendacji.";
export const ADMIN_CANNOT_BE_BANNED_EXCEPTION = "Nie możesz zbanować administratora.";
export const USER_HAS_BEEN_BANNED_EXCEPTION = "Zostałeś zbanowany i nie możesz wykonać tej akcji.";
export const USER_NOT_LOGGED_IN_EXCEPTION = "Brak dostępu - musisz się zalogować.";
export const PASSWORD_EXCEPTION = `Hasło musi mieć co najmniej ${PASSWORD_MIN_LENGTH} znaków, w tym wielką literę i cyfrę.`;
export const PASSWORD_MAX_LENGTH_EXCEPTION = `Hasło może mieć maksymalnie ${PASSWORD_MAX_LENGTH} znaków.`;
export const NICK_MAX_LENGTH_EXCEPTION = `Nick może mieć maksymalnie ${NICK_MAX_LENGTH} znaki.`;
export const FAVORITE_CLUB_MAX_LENGTH_EXCEPTION = `W pole z ulubionym klubem można wpisać maksymalnie ${FAVORITE_CLUB_MAX_LENGTH} znaków.`;
export const FAVORITE_FOOTBALLER_MAX_LENGTH_EXCEPTION = `W pole z ulubionym piłkarzem można wpisać maksymalnie ${FAVORITE_FOOTBALLER_MAX_LENGTH} znaków.`;
export const COMMENT_CONTENT_MAX_LENGTH_EXCEPTION = `Komentarz może mieć maksymalnie ${COMMENT_CONTENT_MAX_LENGTH} znaki.`;
export const NATIONALITY_CODE_LENGTH_EXCEPTION = `Kod narodowości musi składać się z ${NATIONALITY_CODE_LENGTH} znaków.`;
export const PLAYER_NAME_MAX_LENGTH_EXCEPTION = `Imię piłkarza może mieć maksymalnie ${PLAYER_NAME_MAX_LENGTH} znaków.`;
export const PLAYER_SURNAME_MAX_LENGTH_EXCEPTION = `Nazwisko piłkarza może mieć maksymalnie ${PLAYER_NAME_MAX_LENGTH} znaków.`;
export const EMAIL_MAX_LENGTH_EXCEPTION = `E-mail może mieć maksymalnie ${EMAIL_MAX_LENGTH} znaków.`;