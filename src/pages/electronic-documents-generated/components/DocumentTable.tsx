import React from 'react';
import { Routes } from '@constants/Paths';
import { ACCEPT_EMAIL_NO_SENT } from '@constants/CorrectionElectronicInvoice';
import { Link, LinkColor } from '@components/button';
import { DownloadIcons } from '@components/icon';
import { NA, Table } from '@components/table';
import { TYPE_NAVIGATION } from '@pages/consult-electronic-document';
import { getDateFromUnix } from '@utils/Date';
import { formatMoney } from '@utils/Decimals';
import { downloadIconsProps } from '@utils/DownloadFile';
import { getRoute } from '@utils/Paths';
import { isEven } from '@utils/Number';
import { ModuleApp, ElementType, ActionElementType, generateId } from '@utils/GenerateId';
import { ANSWER_DIAN } from '@information-texts/CorrectedDocuments';
import { IDocumentTableProps, TableFooter, TableHeader } from '.';

export const DocumentTable: React.FC<IDocumentTableProps> = ({ data, downloadFile, paginatorBack, isLoadingTable }) => (
    <div>
        <DownloadIcons {...downloadIconsProps(downloadFile, ModuleApp.ELECTRONIC_DOCUMENTS)} className="my-4.5" withoutText />
        <Table
            id={generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `generated`,
                action: ActionElementType.INFO,
                elementType: ElementType.TBL,
            })}
            isLoading={isLoadingTable}
            customTable
            className="document-table"
            data={[]}
            footerRowsCustom={<TableFooter data={data || []} />}
            headerRowsCustom={<TableHeader />}
            isFooterRowsCustom
            isHeaderRowsCustom
            paginatorBackendData={paginatorBack}
        >
            {data?.map(({ DIAN_response, ...item }, index) => (
                <tr
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `generated-${item.id}-${index}`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ROW,
                    })}
                    key={item?.id}
                    className={`${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'}`}
                >
                    <td className={`table-field ${item?.number ? '' : 'table-field--disabled'}`}>
                        {item?.number ? (
                            <Link
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `generated-${item.id}-${index}`,
                                    action: ActionElementType.REDIRECT,
                                    elementType: ElementType.LNK,
                                })}
                                href={`${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${item.id}&type=${
                                    TYPE_NAVIGATION.GENERATED
                                }`}
                                text={String(item.number)}
                                linkColor={LinkColor.PURPLE}
                            />
                        ) : (
                            'N/A'
                        )}
                    </td>
                    <td className="table-field table-field--disabled">{getDateFromUnix(item?.date).formattedDate}</td>
                    <td className="table-field table-field--disabled">{item?.client_name || item?.supplier_name}</td>
                    <td className="table-field table-field--disabled">{item?.number_sold}</td>
                    <td className="table-field table-field--disabled">{formatMoney(item?.total)}</td>
                    <td className="table-field table-field--disabled">
                        {DIAN_response === ACCEPT_EMAIL_NO_SENT ? ANSWER_DIAN.EMAIL_NO_SENT : DIAN_response || NA}
                    </td>
                    <td className="table-field table-field--disabled">{item?.customer_response || NA}</td>
                </tr>
            ))}
        </Table>
    </div>
);
