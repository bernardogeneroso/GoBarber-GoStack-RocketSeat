export default interface iHashProvider {
	generateHash(payload: string): Promise<string>;
	compareHash(payload: string, hashed: string): Promise<boolean>;
};
