import { setDropdown } from './actions';

test('It should set up calculationType to unit profit', () => {
    const action = setDropdown(true);

    expect(action).toEqual({
        dropdown: true
    });
});
