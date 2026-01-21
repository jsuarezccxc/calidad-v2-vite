import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ONE, SIX_TEEN } from '@constants/Numbers';
import { LinkAdd } from '@components/button';
import { Icon } from '@components/icon';
import { TextInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { formatNumber } from '@utils/Number';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { DEFAULT_PRICE_RAGE, IPriceRange, IPriceRangeNumeric, NEW } from '.';

const PriceRangeManager: React.FC<{ priceRanges: IGenericRecord[]; onUpdate: (ranges: IGenericRecord[]) => void }> = ({
    priceRanges,
    onUpdate,
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempRange, setTempRange] = useState<IPriceRange>(DEFAULT_PRICE_RAGE);
    const [error, setError] = useState<string | null>(null);

    const extractNumberFromPrice = (formattedPrice: string): string => {
        return formattedPrice.replace(/\D/g, '') || '';
    };

    const startEditing = (range?: IGenericRecord): void => {
        setEditingId(range?.id || NEW);
        setTempRange({
            min: range?.min ? String(range.min) : '',
            max: range?.max ? String(range.max) : '',
        });
    };

    const cancelEditing = (): void => {
        setEditingId(null);
        setTempRange(DEFAULT_PRICE_RAGE);
        setError(null);
    };
    const validate = (id: string): boolean => {
        const { min, max } = getValues();

        if (min >= max) {
            setError('El rango mínimo no debe ser mayor al rango máximo');
            return false;
        }

        if (
            priceRanges?.some(
                range => range.id !== id && (range.min === min || range.min === max || range.max === max || range.max === min)
            )
        ) {
            setError('*Ya cuenta con este rango de precio');
            return false;
        }

        setError(null);
        return true;
    };

    const getValues = (): IPriceRangeNumeric => ({
        min: parseInt(extractNumberFromPrice(tempRange.min)),
        max: parseInt(extractNumberFromPrice(tempRange.max)),
    });

    const handleAdd = (): void => {
        if (editingId) return;
        startEditing(!priceRanges?.length ? undefined : { min: getformatedPrice(String(priceRanges?.at(-ONE)?.max + ONE)) });
    };

    const handleEdit = (range: IGenericRecord): void => {
        if (editingId) return;
        startEditing({ ...range, min: getformatedPrice(String(range.min)), max: getformatedPrice(String(range.max)) });
    };

    const handleSave = (): void => {
        if (!validate(editingId ?? '')) return;

        const newRange = {
            id: editingId === NEW ? uuid() : editingId,
            ...getValues(),
        };
        const updateExistingRange = priceRanges?.map(range => (range?.id === editingId ? newRange : range));

        const updatedRanges = editingId === NEW ? [...(priceRanges ?? []), newRange] : updateExistingRange;

        onUpdate(updatedRanges);
        cancelEditing();
    };

    const handleDelete = (id: string): void => {
        onUpdate(priceRanges.filter(range => range.id !== id));
    };

    const getformatedPrice = (value: string): string => {
        const newValue = extractNumberFromPrice(value);
        return !newValue ? newValue : `$ ${formatNumber(parseInt(newValue), {})}`;
    };

    const handleFormChange = (name: string, value: string): void => {
        setTempRange(prev => ({ ...prev, [name]: extractNumberFromPrice(value) ? getformatedPrice(value) : '' }));
    };

    return (
        <section className="price-range gap-2 flex flex-col my-4.5">
            <h2 className="composite-editor__title">Establezca el rango de precios</h2>

            {priceRanges?.map(range => (
                <div key={range.id} className="flex flex-row justify-between gap-3">
                    {editingId === range.id ? (
                        <PriceRangeForm
                            range={tempRange}
                            onChange={handleFormChange}
                            onSave={handleSave}
                            onCancel={cancelEditing}
                            error={error}
                        />
                    ) : (
                        <>
                            <p className="flex-1 text-sm font-aller text-gray-dark">
                                {`${getformatedPrice(String(range.min))} -  ${getformatedPrice(String(range.max))}`}
                            </p>
                            <div className="flex flex-row gap-2.5 items-center">
                                <Icon
                                    name="editBlue"
                                    classIcon={editingId ? 'disabled--icon cursor-default' : 'cursor-pointer'}
                                    onClick={(): void => handleEdit(range)}
                                />
                                <Icon name="trashBlue" classIcon="cursor-pointer" onClick={(): void => handleDelete(range.id)} />
                            </div>
                        </>
                    )}
                </div>
            ))}

            {editingId === NEW && (
                <PriceRangeForm
                    range={tempRange}
                    onChange={handleFormChange}
                    onSave={handleSave}
                    onCancel={cancelEditing}
                    error={error}
                />
            )}

            <LinkAdd disabled={!!editingId} text="+ Agregar rango de precio" onClick={handleAdd} />
        </section>
    );
};

export default PriceRangeManager;

const PriceRangeForm: React.FC<{
    range: { min: string; max: string };
    onChange: (name: string, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    error?: string | null;
}> = ({ range, onChange, onSave, onCancel, error }) => (
    <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-1">
            <TextInput
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-catalog-min-price-range`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                placeholder="Mínimo"
                name="min"
                value={range.min}
                maxLength={SIX_TEEN}
                onChange={({ target: { name, value } }): void => onChange(name, value)}
                classesWrapper="price-range__input"
            />
            <span className="text-gray">-</span>
            <TextInput
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-catalog-max-price-range`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                placeholder="Máximo"
                name="max"
                maxLength={SIX_TEEN}
                value={range.max}
                onChange={({ target: { name, value } }): void => onChange(name, value)}
                classesWrapper="price-range__input"
            />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-catalog-price-range`,
                    action: ActionElementType.SAVE,
                    elementType: ElementType.ICO,
                })}
                name="checkBlue"
                onClick={onSave}
                classIcon="cursor-pointer"
            />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-catalog-price-range`,
                    action: ActionElementType.CANCEL,
                    elementType: ElementType.ICO,
                })}
                name="cancelBlue"
                onClick={onCancel}
                classIcon="cursor-pointer"
            />
        </div>
        {error && <p className="w-full text-right text-purple text-tiny">{error}</p>}
    </div>
);
