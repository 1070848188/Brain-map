// 扫描页面表格展示配置
import _, { cloneDeep } from 'lodash';
// import { trimStr } from '../../../../util/helper.js';
import { formatNum } from '@/util/numberUtil';

/**
 * @description 还款行行信息表头配置
 * @param {*} _this 指向组件
 * @param {*} listName 表格在组件中对应的名称
 * @returns 还款行行信息表头
 */
export const lineColumns = (_this, listName = 'lineListData') => {
  return [
    {
      type: 'index',
      minWidth: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '借款单号',
      minWidth: 140,
      align: 'center',
      key: 'loanNo'
    },
    {
      title: '还款方式',
      minWidth: 140,
      align: 'center',
      key: 'repaymentTypeName'
    },
    {
      title: '还款金额',
      minWidth: 140,
      align: 'center',
      key: 'totalAmount',
      render: (h, params) => {
        let _num = params.row.totalAmount ? (Number(params.row.totalAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '还款日期',
      minWidth: 180,
      key: 'receiptRepaymentDetailItemList',
      align: 'center',
      childrenKey: 'receiveAmountDate',
      require: true,
      render: (h, params) => {
        return h(
          'div', { attrs: { class: 'mergeTab', style: 'padding-right: 10px;' } },
          params.row.receiptRepaymentDetailItemList && params.row.receiptRepaymentDetailItemList.length !== 0
            ? [
              h('ul',
                  params.row.receiptRepaymentDetailItemList.map(
                    (item, _i) => {
                      const dom = item.isFakeMate === 1
                      ? h('DatePicker', {
                        props: {
                          value: item.receiveAmountDate,
                          type: 'date',
                          format: 'yyyy-MM-dd',
                          transfer: true
                        },
                        on: {
                          'on-change': (val) => {
                            item.receiveAmountDate = val;
                            _this[listName][params.index] = params.row;
                          }
                        }
                      }) : h('div', { attrs: { class: 'tab-items' } }, item.receiveAmountDate
                        ? new Date(item.receiveAmountDate).format('yyyy-MM-dd') : '');
                      return h(
                        'li',
                        {
                          attrs: {
                            style: 'text-align: center;padding-left: 18px'
                          }
                        },
                        [ dom ]
                      );
                    }
                  )
                )
            ]
            : ''
        );
      }
    },
    {
      title: '还款账号',
      minWidth: 180,
      key: 'receiptRepaymentDetailItemList',
      childrenKey: 'bankAccount',
      align: 'center',
      require: true,
      render: (h, params) => {
        return h(
          'div', { attrs: { class: 'mergeTab', style: 'padding-right: 10px;' } },
          params.row.receiptRepaymentDetailItemList && params.row.receiptRepaymentDetailItemList.length !== 0
            ? [
              h('ul',
                  params.row.receiptRepaymentDetailItemList.map(
                    (item, _i) => {
                      const dom = item.isFakeMate === 1
                      ? h('Input', {
                        props: {
                          value: item.bankAccount,
                          maxlength: 30
                        },
                        on: {
                          input: (val) => {
                            item.bankAccount = val.trim();
                            _this.$nextTick(() => { // 不知道为什么直接赋值有问题
                              item.bankAccount = item.bankAccount.replace(/[^0-9]/ig, '');
                              _this[listName][params.index] = params.row;
                            });
                          }
                        }
                      }) : h('div', { attrs: { class: 'tab-items' } }, item.bankAccount || '');
                      return h(
                        'li',
                        {
                          attrs: {
                            style: 'text-align: center;padding-left: 18px'
                          }
                        },
                        [ dom ]
                      );
                    }
                  )
                )
            ]
            : ''
        );
      }
    },
    {
      title: '流水号',
      minWidth: 180,
      key: 'receiptRepaymentDetailItemList',
      childrenKey: 'runningNo',
      align: 'center',
      require: true,
      render: (h, params) => {
        return h(
          'div', { attrs: { class: 'mergeTab', style: 'padding-right: 10px;' } },
          params.row.receiptRepaymentDetailItemList && params.row.receiptRepaymentDetailItemList.length !== 0
            ? [
              h('ul',
                  params.row.receiptRepaymentDetailItemList.map(
                    (item, _i) => {
                      const dom = item.isFakeMate === 1
                      ? h('Input', {
                        props: {
                          value: item.runningNo,
                          maxlength: 30
                        },
                        on: {
                          input: (val) => {
                            item.runningNo = val.trim();
                            // 直接修改值为数字有bug，所以把过滤数字外字符放到微任务列表
                            _this.$nextTick(() => {
                              item.runningNo = item.runningNo.replace(/[\W]/g, '');
                              _this[listName][params.index] = params.row;
                            });
                          }
                        }
                      }) : h('div', { attrs: { class: 'tab-items' } }, item.runningNo || '');
                      return h(
                        'li',
                        {
                          attrs: {
                            style: 'text-align: center;padding-left: 18px'
                          }
                        },
                        [ dom ]
                      );
                    }
                  )
                )
            ]
            : ''
        );
      }
    },
    {
      title: '本次认款金额',
      minWidth: 180,
      key: 'receiptRepaymentDetailItemList',
      childrenKey: 'totalAmount',
      align: 'center',
      require: true,
      render: (h, params) => {
        const waterList = params.row.receiptRepaymentDetailItemList || [];
        return h(
          'div', { attrs: { class: 'mergeTab', style: 'padding-right: 10px;' } },
          waterList && waterList.length !== 0
            ? [
              h('ul',
              waterList.map(
                    (item, _i) => {
                      const dom = item.isFakeMate === 1
                      ? h('InputNumber', {
                        props: {
                          value: Number(item.totalAmount) || 0
                        },
                        on: {
                          input: (val) => {
                            item.totalAmount = val;
                            _this[listName][params.index] = params.row;
                          }
                        }
                      }) : h('div', { attrs: { class: 'tab-items' } }, item.totalAmount ? formatNum(item.totalAmount, 2) || '' : '');
                      return h(
                        'li',
                        {
                          attrs: {
                            style: 'text-align: center;padding-left: 18px'
                          }
                        },
                        [ dom ]
                      );
                    }
                  )
                )
            ]
            : ''
        );
      }
    },
    {
      title: '备注',
      minWidth: 180,
      key: 'receiptRepaymentDetailItemList',
      childrenKey: 'remark',
      align: 'center',
      render: (h, params) => {
        const waterList = params.row.receiptRepaymentDetailItemList || [];
        return h(
          'div', { attrs: { class: 'mergeTab', style: 'padding-right: 10px;' } },
          waterList && waterList.length !== 0
            ? [
              h('ul',
              waterList.map(
                    (item, _i) => {
                      const dom = item.isFakeMate === 1
                      ? h('Input', {
                        props: {
                          value: item.remark,
                          maxlength: 40
                        },
                        on: {
                          input: (val) => {
                            item.remark = val.trim();
                            _this[listName][params.index] = params.row;
                          }
                        }
                      }) : h('div', { attrs: { class: 'tab-items' } }, item.remark || '');
                      return h(
                        'li',
                        {
                          attrs: {
                            style: 'text-align: center;padding-left: 18px'
                          }
                        },
                        [ dom ]
                      );
                    }
                  )
                )
            ]
            : ''
        );
      }
    },
    {
      title: '操作',
      align: 'center',
      minWidth: 170,
      fixed: 'right',
      render: (h, params) => {
        const waterList = params.row.receiptRepaymentDetailItemList || [];
        const isEditState = _this.basicMassege.flowNodeType === 'cash';// 节点为资金审核才可以编辑
        const haveId = waterList.filter(l => l.repaymentDetailItemId).length; // 后台目前流水行的行数
        return h(
          'div', { attrs: { class: 'mergeTab', style: 'padding-right: 10px;' } },
          waterList && waterList.length !== 0
            ? [
              h('ul',
              waterList.map((item, _i) => {
                let editRender;
                // 资金节点且还款方式为'银行转账'或'意外险赔付'才可进行编辑，新增，删除
                if (isEditState && [ 'bankTransfer', 'insurancePayment' ].includes(params.row.repaymentType) &&
                  _this.formInfoFormRoute.fromPath === 'myTasks') {
                  if (item.isFakeMate === 1) { // 编辑状态 展示保存和取消
                    editRender = h('div', {
                      style: 'display: flex;justify-content: space-around;height: 36px;align-items: center;'
                    }, [
                      h( // 保存
                          'a',
                        {
                          props: {
                            type: 'primary'
                          },
                          class: {
                            'table-save-text-btn': item._prevSecondLoading
                          },
                          on: {
                            click: () => {
                            // 保存
                              _this.editWaterLine(item, { ...params.row, receiptRepaymentDetailItemList: [ item ] });
                            }
                          }
                        },
                          _this.$i18n.t('common.save')
                        ),
                      h( // 取消
                          'a',
                        {
                          props: { type: 'primary' },
                          class: { 'table-save-text-btn': item._prevSecondLoading },
                          on: {
                            click: () => {
                            // 判断当前行是新增还是修改
                              if (item.isLocalAddRow) { // 新增数据删除
                                waterList.splice(_i, 1); // 删除新增行
                              // 若数组为空，默认新增一个空对象，目的为了展示新增按钮
                                waterList.length === 0 && waterList.push({});
                              } else {
                              // 还原编辑前信息
                                _this.$set(waterList, _i, _this.lineEditData);
                              }
                              _this.lineEditData = null; // 取消当前编辑状态
                            }
                          }
                        },
                          '取消'
                        )
                    ]);
                  } else {
                    editRender = h('div', {
                      style: 'display: flex;justify-content: space-around;height: 36px;align-items: center;'
                    }, [
                      // 编辑需要实际流水行>0
                      haveId > 0 && h( // 编辑
                          'a',
                        {
                          props: {
                            type: 'primary'
                          },
                          class: { 'table-save-text-btn': item._prevSecondLoading },
                          on: {
                            click: () => {
                            // 是否已经有正在编辑的行
                              if (_this.lineEditData) {
                                _this.$Message.info('不可同时编辑多行');
                                return;
                              }
                            // 储存当前编辑信息
                              _this.lineEditData = cloneDeep(item);
                            // 首先本行进入编辑状态
                              _this.$set(item, 'isFakeMate', 1);
                            }
                          }
                        },
                          _this.$i18n.t('common.edit')
                        ),
                      h( // 新增都可以
                          'a',
                        {
                          props: {
                            type: 'primary'
                          },
                          class: { 'table-save-text-btn': item._prevSecondLoading },
                          on: {
                            click: () => {
                            // 是否已经有正在编辑的行
                              if (_this.lineEditData) {
                                _this.$Message.info('不可同时编辑多行');
                                return;
                              }
                              const initWaterObj = {
                                receiveAmountDate: '', // 还款日期
                                bankAccount: '', // 还款账号
                                runningNo: '', // 流水号
                                totalAmount: '', // 本次认款金额
                                remark: '', // 备注
                                isLocalAddRow: true, // 标识为前端新增
                                isFakeMate: 1 // 默认为编辑状态
                              };
                              _this.lineEditData = initWaterObj; // 标识本次有正在编辑的行
                              if (haveId === 0) { // haveId为0代表本还款单无流水行，则初始化新的数据
                                params.row.receiptRepaymentDetailItemList = [ initWaterObj ];
                              } else { // 否则代表是新增行
                                params.row.receiptRepaymentDetailItemList.push(initWaterObj);
                              }
                            }
                          }
                        },
                          '新增'
                        ),
                    // 删除需要分单据, 银行转账需要实际流水行>1, 意外险需要流水>0
                      haveId > 0 && h(
                        'a',
                        {
                          props: {
                            type: 'primary'
                          },
                          class: { 'table-save-text-btn': item._prevSecondLoading },
                          on: {
                            click: () => {
                              _this.$Modal.confirm({
                                title: '操作',
                                content: '<p>是否确认删除</p>',
                                onOk: () => {
                                  _this.delWaterInvoice(item, { ...params.row, receiptRepaymentDetailItemList: [ item ] });
                                },
                                onCancel: () => {
                                  _this.$Message.info('删除已取消');
                                }
                              });
                            }
                          }
                        },
                        _this.$i18n.t('common.delete')
                      )
                    ]);
                  }
                } else {
                  editRender = h('div', { attrs: { class: 'tab-items' } }); // 非资金节点不可编辑
                }
                return h(
                  'li',
                  {
                    attrs: {
                      style: 'text-align: center;padding-left: 18px'
                    }
                  },
                  [ editRender ]
                );
              })
             )
            ]
            : ''
        );
      }
    }
  ];
};

// 费用明细列表
export let expensesDetailsColumns = _this => {
  console.log(_this.basicMassege.businessTypeName, '------');
  let expensesDetailsColumns = [
    {
      type: 'index',
      width: 50,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.costIdentification'
      ),
      key: 'feeFlag',
      align: 'center',
      width: 120
    },
    {
      title: _this.basicMassege.businessTypeName === '国内业务招待' ? '业务招待类型' : _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.costType'
      ),
      key: 'feeTypeName',
      align: 'center',
      width: 120
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.occurredTime'
      ),
      key: 'occurredTime',
      align: 'center',
      width: 120,
      render: (h, params) => {
        let _num = params.row.occurredTime
          ? new Date(params.row.occurredTime).format('yyyy-MM-dd')
          : '-';
        return h('div', _num);
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.approvedAmountExcludingTax'
      ),
      key: 'noneTaxAmountReal',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (!params.row.isFakeMate) {
          return h('div', params.row.noneTaxAmountReal.toFixed(_this.quantile));
        } else {
          return h('InputNumber', {
            props: {
              min: 0.0,
              // step: 0.01,
              precision: _this.basicMassege.quantile,
              value: params.row.noneTaxAmountReal
            },
            on: {
              'on-change': (val) => {
                let taxAmount = Number(params.row.totalAmount) - val;
                params.row.noneTaxAmountReal = val;
                params.row.taxAmount = taxAmount;
                _this.expensesDetailsTableData[params.index] = params.row;
              }
            }
          });
        }
      }
    },
    {
      title: '核定税率',
      key: 'taxRate',
      align: 'center',
      width: 100,
      render: (h, params) => {
        if (!params.row.isFakeMate) {
          return h('div', params.row.taxRateReal * 100 + '%');
        } else {
          let arry = [];
          _this.taxRates.map((_item) => {
            arry.push(
              h(
                'Option',
                {
                  props: {
                    value: Number(_item.taxRateValue / 100)
                  },
                  nativeOn: {
                    click: () => {
                      // params.row.condConditionValue = _item.taxRateValue;
                      // params.row.condConditionName = _item.taxRateValue;
                      // _this.conditionList[index] = row
                    }
                  }
                },
                _item.taxRateValue + '%'
              )
            );
          });
          return h(
            'Select',
            {
              attrs: {
                value: params.row.taxRateReal,
                transfer: true
              },
              on: {
                'on-change': (val) => {
                  params.row.taxRateReal = val;
                  params.row.noneTaxAmountReal =
                    params.row.totalAmount / (1 + val);
                  params.row.taxAmount =
                    params.row.totalAmount - params.row.noneTaxAmountReal;
                  _this.expensesDetailsTableData[params.index] = params.row;
                }
              }
            },
            arry
          );
        }
      }
    },
    {
      title: '税额',
      key: 'taxAmount',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', params.row.taxAmount.toFixed(_this.quantile));
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.totalSum'
      ),
      key: 'totalAmount',
      align: 'center',
      width: 80,
      render: (h, params) => {
        return h('div', params.row.totalAmount.toFixed(_this.quantile));
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.detail'
      ),
      key: 'detail',
      align: 'center',
      minWidth: 170,
      render: (h, params) => {
        const _dd = params.row.detail && JSON.parse(params.row.detail);
         // 国内业务招待类型单据详情需过滤包含机构名称的展示
        const type = [ '国内业务招待' ].includes(_this.basicMassege.businessTypeName);
        return (params.row.detail
          ? <div>
            {
              // 需要把除费用详情外所有属性渲染出来
              Object.keys(_dd).filter(key => key !== '费用详情' && (type ? !key.includes('机构名称') : true))
              .map(item => `${item}:${_dd[item]};`)
            }
            { _dd['费用详情'] && <span>费用详情：</span>}
            { // 费用详情相关信息单独处理
              _dd['费用详情'] && _dd['费用详情'].map(item =>
                <p style="text-align: left">{`${`${item.date} | ` || ''}${item.avgAmount && formatNum(item.avgAmount, 2)} * ${item.count || ''}、`}</p>
                )
            }
          </div> : '-'
        );
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.financialMark'
      ),
      key: 'sellerName',
      align: 'center',
      width: 80,
      render: (h, params) => {
        return h('i-switch', {
          attrs: {
            disabled: !!_this.isRead
          },
          props: {
            // 这里可以设置它的属性
            disabled: !!_this.isRead,
            value: !!params.row.isSign // 设置它的值比如：true或false
          },
          on: {
            // 操作事件
            'on-change': function (_v) {
              params.row.isSign = _v;
              _this.changeFeeFlag(params.row, (flag, _sign) => {
                params.row.isSign = flag ? _sign : !flag;
                _this.expensesDetailsTableData[params.index].isSign = params.row.isSign;
              });
            }
          }
        });
      }
    },
    {
      title: '缺票金额',
      key: 'nonInvoiceAmount',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (!params.row.isFakeMate) {
          return h('div', params.row.nonInvoiceAmount.toFixed(_this.quantile));
        } else {
          return h('InputNumber', {
            props: {
              min: 0.0,
              // step: 0.01,
              // precision: 2,
              value: params.row.nonInvoiceAmount
            },
            on: {
              input: (val) => {
                params.row.nonInvoiceAmount = val;
                _this.expensesDetailsTableData[params.index] = params.row;
              }
            }
          });
        }
      }
    },
    {
      title: '#A',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (!params.row.isFakeMate) {
          return h('div', params.row.remarkAmount.toFixed(_this.quantile));
        } else {
          return h('InputNumber', {
            props: {
              min: 0.0,
              // step: 0.01,
              // precision: 2,
              value: params.row.remarkAmount
            },
            on: {
              input: (val) => {
                params.row.remarkAmount = val || 0;
                _this.expensesDetailsTableData[params.index] = params.row;
              }
            }
          });
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.expensesDetail.remarks'
      ),
      key: 'remark',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (!params.row.isFakeMate) {
          return h('div', params.row.remark);
        } else {
          return h('Input', {
            props: {
              value: params.row.remark
            },
            on: {
              input: (val) => {
                params.row.remark = val.trim();
                _this.expensesDetailsTableData[params.index] = params.row;
              }
            }
          });
        }
      }
    },
    {
      title: _this.$i18n.t('financeModule.collection.signColumns.operation'),
      key: 'sellerDp',
      align: 'center',
      fixed: 'right',
      width: 130,
      render: (h, params) => {
        // 新增行登记功能  只有初审可编辑 其他都是只有查看权限(查看权限需要满足行登记列表length>1)
        // 涉及范围只有报销单
        let lineCloumnOpera = null;
        if ([ '报销单', '差旅报销单' ].includes(_this.basicMassege.receiptTypeName)) { // 报销单
          // 是当前待办或者不是当前待办，但是存在行登记列表
          if (!_this.isRead || (_this.isRead && params.row.isSign === 1)) {
            lineCloumnOpera = h(
              'div',
              {
                props: { type: 'primary' },
                style: { width: '50%' },
                on: {
                  click: () => {
                    _this.openLineCheckModal(params.row);
                  }
                }
              },
              [ h('a', { parops: { type: 'primary' } }, '行登记') ]
            );
          }
        }
        // 非当前代办
        if (_this.isRead) {
          // 非当前代办增加按钮 所以转为数组存储
          let buttonList = [];
          // 简化原附件判断逻辑
          if (params.row.downloadLink && params.row.downloadLink.length > 0) {
            buttonList.push(h(
              'div',
              {
                props: {
                  type: 'primary'
                },
                style: { width: '50%' },
                on: {
                  click: () => {
                    console.log('附件');
                    _this.showImgModal(params.row.downloadLink);
                  }
                }
              },
              [ h('a', { parops: { type: 'primary' } }, '附件') ]
            ));
          }
          // 行登记按钮展示逻辑
          lineCloumnOpera && buttonList.push(lineCloumnOpera);
          if (buttonList.length > 0) {
            return h('div', {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }
            }, buttonList);
          } else {
            return h('div');
          }
        } else {
          if (params.row.isFakeMate === 1) {
            return h('div', [
              h(
                'a',
                {
                  props: {
                    type: 'primary'
                  },
                  class: {},
                  style: {
                    marginLeft: '20px'
                  },
                  on: {
                    click: () => {
                      console.log('保存');
                      params.row.isFakeMate = 0;
                      _this.editInvoice.feeId = params.row.feeId;
                      _this.editInvoice.noneTaxAmountReal =
                        params.row.noneTaxAmountReal;
                      _this.editInvoice.taxRateReal = params.row.taxRateReal;
                      _this.editInvoice.taxAmount = params.row.taxAmount;
                      _this.editInvoice.nonInvoiceAmount =
                        params.row.nonInvoiceAmount;
                      _this.editInvoice.remarkAmount =
                        params.row.remarkAmount;
                      _this.editInvoice.remark = params.row.remark;
                      _this.savaInput(params.index);
                    }
                  }
                },
                _this.$i18n.t('common.save')
              ),
              h(
                'a',
                {
                  props: {
                    type: 'primary'
                  },
                  class: {},
                  style: {
                    marginLeft: '20px'
                  },
                  on: {
                    click: () => {
                      console.log('取消');
                      params.row.isFakeMate = 0;
                      let _index = null;
                      _this.editDetailsArr.forEach(function (item, index) {
                        var _item = JSON.parse(item);
                        if (
                          _this.expensesDetailsTableData[params.index].feeId ===
                          _item.feeId
                        ) {
                          _index = index;
                          params.row.taxRate = _item.taxRate;
                          params.row.taxAmount = _item.taxAmount;
                          params.row.taxRateReal = _item.taxRateReal;
                          params.row.nonInvoiceAmount = _item.nonInvoiceAmount;
                          params.row.noneTaxAmount = _item.noneTaxAmount;
                          params.row.noneTaxAmountReal =
                            _item.noneTaxAmountReal;
                          params.row.totalAmount = _item.totalAmount;
                          params.row.isSign = _item.isSign;
                          params.row.remark = _item.remark;
                          // _this.expensesDetailsTableData[params.index].taxRate = _item.taxRate
                          // _this.expensesDetailsTableData[params.index].taxAmount = _item.taxAmount
                          // _this.expensesDetailsTableData[params.index].taxRateReal = _item.taxRateReal

                          // console.log('取消之前' + _this.editspeArr)

                          // console.log('取消之后' + _this.editspeArr)
                        }
                      });
                      _this.editDetailsArr.splice(_index, 1);
                      _this.expensesDetailsTableData[params.index] = params.row;
                    }
                  }
                },
                '取消'
              )
            ]);
          } else {
            // 操作列按钮太多  样式调整
            let _commonShow = [
              h(
                'div',
                {
                  props: {
                    type: 'primary'
                  },
                  class: {},
                  style: {
                    width: '50%'
                  },
                  on: {
                    click: () => {
                      console.log('暂存');
                      _this.addOnion('fee', params.row);
                    }
                  }
                },
                [ h('a', { parops: { type: 'primary' } },
                _this.$i18n.t(
                  'financeModule.expenseAccount.expensesDetail.temporaryStorage'
                )) ]
              ),
              // 驳回功能
              // h(
              //   'a',
              //   {
              //     props: {
              //       type: 'primary'
              //     },
              //     class: {},
              //     style: {
              //       marginLeft: '20px'
              //     },
              //     on: {
              //       click: () => {
              //         console.log('驳回')
              //       }
              //     }
              //   },
              //   '驳回'
              // ),
              h(
                'div',
                {
                  props: {
                    type: 'primary'
                  },
                  class: {},
                  style: {
                    width: '50%'
                  },
                  on: {
                    click: () => {
                      console.log('编辑');
                      _this.expensesDetailsTableData[params.index].key =
                        'key' + params.index;
                      _this.zifu = JSON.stringify(
                        _this.expensesDetailsTableData[params.index]
                      );
                      _this.editDetailsArr.push(_this.zifu);
                      // _this.changeInput(params.index)
                      _this.$set(params.row, 'isFakeMate', 1);
                      _this.expensesDetailsTableData[params.index].isFakeMate =
                        params.row.isFakeMate;
                    }
                  }
                },
                [ h('a', { parops: { type: 'primary' } }, _this.$i18n.t('common.edit')) ]
              )
            ];
            if (params.row.downloadLink && params.row.downloadLink.length) {
              _commonShow.push(
                h(
                  'div',
                  {
                    props: {
                      type: 'primary'
                    },
                    class: {},
                    style: {
                      width: '50%'
                    },
                    on: {
                      click: () => {
                        console.log('附件');
                        _this.showImgModal(params.row.downloadLink);
                      }
                    }
                  },
                  [ h('a', { parops: { type: 'primary' } }, '附件') ]
                )
              );
            }
            // 新增行登记功能  只有初审可编辑 其他都是只有查看权限(查看权限需要满足行登记列表length>1)
            // if (params.row.downloadLink && params.row.downloadLink.length) {
            lineCloumnOpera && _commonShow.push(lineCloumnOpera);
            // }
            if ([ '差旅报销单', '报销单' ].indexOf(_this.basicMassege.receiptType) !== -1 && [ 1, 3 ].indexOf(_this.basicMassege.property) !== -1) {
              _commonShow.push(
                h(
                  'div',
                  {
                    props: {
                      type: 'primary'
                    },
                    class: {},
                    style: {
                      width: '50%'
                    },
                    on: {
                      click: () => {
                        _this.editRowRateAmount(params.row);
                      }
                    }
                  },
                  '税额核减'
                )
              );
            }
            return h('div', {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }
            }, _commonShow);
          }
        }
      }
    }
  ];
  return expensesDetailsColumns;
};
// 借款列表
export let rushLoanColumns = _this => {
  let rushLoanColumns = [
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.rushLoanColumns.loanAmount'
      ),
      key: 'totalAmount',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', params.row.totalAmount.toFixed(2));
      }
    },
    {
      title: '借款余额',
      key: 'balance',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', params.row.balance.toFixed(2));
      }
    },
    {
      title: _this.$i18n.t('financeModule.collection.signColumns.operation'),
      key: 'sellerDp',
      align: 'center',
      width: 180,
      render: (h, params) => {
        if (_this.isRead) {
          return h('div');
        }
        return h('div', [
          h(
            'a',
            {
              props: {
                type: 'primary'
              },
              class: {},
              on: {
                click: () => {
                  _this.addOnion('all');
                }
              }
            },
            _this.$i18n.t(
              'financeModule.expenseAccount.expensesDetail.temporaryStorage'
            )
          )
        ]);
      }
    }
  ];
  return rushLoanColumns;
};

// 行登记表头
export let lineCheckColumns = _this => {
  let lineCheckColumns = [
    {
      type: 'index',
      width: 50,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '#A类型',
      key: 'aType',
      align: 'center',
      render: (h, params) => {
        if (params.row.type === 'edit') {
          return h('Select', {
            props: {
              value: params.row.aType,
              transfer: true
            },
            on: {
              'on-change': (val) => {
                params.row.aType = val;
              }
            }
          }, _this.lineCheckTypes.map(option => {
            return h('Option', {
              attrs: {
                label: option.name,
                value: option.code
              }
            });
          }));
        } else {
          return h('div',
          (_this.lineCheckTypes.find(l => params.row.aType === l.code) || {}).name || '-');
        }
      }
    },
    {
      title: '#B费用金额',
      key: 'bFeeAmount',
      align: 'center',
      render: (h, params) => {
        if (params.row.type === 'edit') {
          return h('InputNumber', {
            props: {
              value: params.row.bFeeAmount,
              transfer: true
            },
            on: {
              'on-change': (val) => {
                params.row.bFeeAmount = val;
              }
            }
          });
        } else {
          return h('div', params.row.bFeeAmount === 0 ? 0 : params.row.bFeeAmount || '-');
        }
      }
    },
    {
      title: '#C税额',
      key: 'cTaxAmount',
      align: 'center',
      render: (h, params) => {
        if (params.row.type === 'edit') {
          return h('InputNumber', {
            props: {
              value: params.row.cTaxAmount,
              transfer: true
            },
            on: {
              'on-change': (val) => {
                params.row.cTaxAmount = val;
              }
            }
          });
        } else {
          return h('div', params.row.cTaxAmount === 0 ? 0 : params.row.cTaxAmount || '-');
        }
      }
    },
    {
      title: '#D备注',
      key: 'dRemark',
      align: 'center',
      render: (h, params) => {
        if (params.row.type === 'edit') {
          return h('Input', {
            props: {
              value: params.row.dRemark,
              maxlength: 200
            },
            on: {
              input: (val) => {
                params.row.dRemark = val;
              }
            }
          });
        } else {
          return h('div', params.row.dRemark || '-');
        }
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (h, { row, index }) => {
        if (_this.isRead) { // 非当前待办人 无法进行新增 删除
          return h('div');
        }
        if (row.type === 'edit') { // type = 'edit' 代表可以进行新增
          return h('Button', {
            props: {
              type: 'primary',
              loading: _this.editLoading
            },
            on: {
              click: () => {
                // 首先校验数据是否正确
                if (!_this.validLineData(row)) return;
                // 将数据克隆出来，避免内存相同
                const newData = cloneDeep(row);
                delete newData.type; // 辨别操作列
                // 添加到最后一个上面
                _this.lineCheckTableData.splice(_this.lineCheckTableData.length - 1, 0, newData);
                Object.keys(row).forEach(k => { // 重置当前添加行数据
                  k !== 'type' && (row[k] === '');
                });
              }
            }
          }, '添加');
        } else {
          return h('div', [
            h('a', {
              props: {
                type: 'primary'
              },
              class: {},
              on: {
                click: () => {
                  // 点击删除 删除前端行登记信息
                  _this.lineCheckTableData.splice(index, 1);
                }
              }
            }, '删除')
          ]);
        }
      }
    }
  ];
  return lineCheckColumns;
};

// 冲借款列表
export let writeOffLoanColumns = _this => {
  let writeOffLoanColumns = [
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '借款单号',
      key: 'loanReceiptNo',
      align: 'center',
      render: (h, params) => {
        return h('div', [
          h(
              'a',
            {
              props: {
                class: 'el-pointer',
                type: 'primary'
              },
              style: {
                marginRight: '5px'
              },
              class: {},
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'baseReceiptInfo',
                    params: {
                      fromPath: 'loanForm',
                      docId: params.row.loanReceiptNo
                    }
                  });
                }
              }
            },
              params.row.loanReceiptNo || '-'
            )
        ]);
      }
    },
    {
      title: '借款日期',
      key: 'loanDate',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.loanDate ? (new Date(params.row.loanDate).format('yyyy-MM-dd')) : '-';
        return h('div', _num);
      }
    },
    {
      title: '借款金额',
      key: 'balance',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.loanAmount ? (Number(params.row.loanAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '本次冲销金额',
      key: 'balance',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.currentWriteOffAmount !== undefined ? (Number(params.row.currentWriteOffAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '借款人',
      key: 'loanPersonName',
      align: 'center',
      render: (h, params) => {
        return h(
          'div',
          params.row.loanPersonCode
            ? params.row.loanPersonCode + params.row.loanPersonName
            : '-'
        );
      }
    },
    {
      title: '借款余额',
      key: 'loanAvailableAmount',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.loanAvailableAmount !== undefined ? (Number(params.row.loanAvailableAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    }
  ];
  return writeOffLoanColumns;
};
// 安全管理还款单列表
export let writeOffLoanColumns2 = _this => {
  let writeOffLoanColumns2 = [
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '还款金额',
      key: 'repaymentTotalAmount',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.repaymentTotalAmount ? (Number(params.row.repaymentTotalAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '借款单号',
      key: 'businessCode',
      align: 'center',
      render: (h, params) => {
        return h('div', [
          h(
              'a',
            {
              props: {
                class: 'el-pointer',
                type: 'primary'
              },
              style: {
                marginRight: '5px'
              },
              class: {},
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'baseReceiptInfo',
                    params: {
                      fromPath: 'loanForm',
                      docId: params.row.businessCode
                    }
                  });
                }
              }
            },
              params.row.businessCode || '-'
            )
        ]);
      }
    },
    {
      title: '借款人',
      key: 'borrower',
      align: 'center',
      render: (h, params) => {
        return h(
          'div',
          params.row.borrower
            ? params.row.borrowerEmployeeId + params.row.borrower
            : '-'
        );
      }
    },
    {
      title: '借款金额',
      key: 'amount',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.amount ? (Number(params.row.amount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '银行转账',
      key: 'bankTransferAmount',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.bankTransferAmount ? (Number(params.row.bankTransferAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '协议票据',
      key: 'agreementPaperAmount',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.agreementPaperAmount ? (Number(params.row.agreementPaperAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '意外险赔付',
      key: 'insurancePaymentAmount',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.insurancePaymentAmount ? (Number(params.row.insurancePaymentAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    },
    {
      title: '借款余额',
      key: 'loanBalanceAmount',
      align: 'center',
      render: (h, params) => {
        let _num = params.row.loanBalanceAmount !== undefined ? (Number(params.row.loanBalanceAmount)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-';
        return h('div', _num);
      }
    }
  ];
  return writeOffLoanColumns2;
};

// 被转移借款单列表
export let TransferredLoanSlipColumns = _this => {
  let TransferredLoanSlipColumns = [
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '员工',
      key: 'borrower',
      align: 'center',
      width: 120
    },
    {
      title: '单据编号',
      key: 'businessCode',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', [
          h(
            'a',
            {
              props: {
                class: 'el-pointer',
                type: 'primary'
              },
              style: {
                marginRight: '5px'
              },
              class: {},
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'baseReceiptInfo',
                    params: {
                      fromPath: 'loanTransfer',
                      docId: params.row.businessCode
                    }
                  });
                }
              }
            },
            params.row.businessCode || '-'
          )
        ]);
      }
    },
    {
      title: '类型',
      key: 'type',
      align: 'center',
      width: 120
    },
    {
      title: '开始日期',
      key: 'startDate',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h(
          'div',
          params.row.startDate
            ? new Date(params.row.startDate).format('yyyy-MM-dd')
            : '-'
        );
      }
    },
    {
      title: '借款金额',
      key: 'amount',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', params.row.amount.toFixed(2));
      }
    },
    {
      title: '虚拟还款单号',
      key: 'virtualBusinessCode',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h(
          'div',
          _this.basicMassege.receiptStatus === 5
            ? params.row.virtualBusinessCode
            : '-'
        );
      }
    }
  ];
  return TransferredLoanSlipColumns;
};

// 差旅申请行程列表
export let travelItinerarysColumns = _this => {
  let travelItinerarysColumns = [
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '往返/单程',
      key: 'receiptNo',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', params.row.roundTrip ? '往返' : '单程');
      }
    },
    {
      title: '出发日期',
      key: 'itineraryDate',
      align: 'center',
      width: 160,
      render: (h, params) => {
        return h('div', params.row.itineraryDate ? new Date(params.row.itineraryDate).format('yyyy-MM-dd') : '-');
      }
    },
    {
      title: '返程日期',
      key: 'endDate',
      align: 'center',
      width: 160,
      render: (h, params) => {
        return h('div', params.row.endDate ? new Date(params.row.endDate).format('yyyy-MM-dd') : '-');
      }
    },
    {
      title: '交通方式',
      key: 'trafficType',
      align: 'center',
      width: 120
    },
    {
      title: '起始地',
      key: 'fromCity',
      align: 'center',
      width: 120
    },
    {
      title: '目的地',
      key: 'toCity',
      align: 'center',
      width: 120
    }
  ];
  return travelItinerarysColumns;
};

// 国内业务招待类型列表分三种，按照后端字段显示
export let requisitionColumns = (_this, type, count) => {
  type = type || _.get(_this.requisitionDatas, 'entertainType', '');
  count = count || _.get(_this.requisitionDatas, 'orgCount', 0);

  let requisitionColumns = {
    '礼物': [
    // {
    //   type: 'index',
    //   width: 80,
    //   align: 'center',
    //   title: _this.$i18n.t('financeModule.collection.signColumns.index')
    // },
      {
        title: '业务招待类型',
        key: 'businessType',
        align: 'center',
        width: 120,
        render: (h, params) => {
          return h('div', type || '-');
        }
      },
      {
        title: '是否政府机构',
        key: 'isAdministration',
        align: 'center',
        width: 120,
        render: (h, params) => {
          return h('div', params.row.isAdministration || '-');
        }
      },
      {
        title: '机构名称',
        key: 'orgName',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.orgName || '-');
        }
      },
      {
        title: '人数',
        key: 'personNumber',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.personNumber || '-');
        }
      },
      {
        title: '金额',
        key: 'giftAmount',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.giftAmount.toFixed(_this.quantile) || '-');
        }
      }
    ],
    '宴请': [
      // {
      //   type: 'index',
      //   width: 80,
      //   align: 'center',
      //   title: _this.$i18n.t('financeModule.collection.signColumns.index')
      // },
      {
        title: '业务招待类型',
        key: 'businessType',
        align: 'center',
        width: 120,
        render: (h, params) => {
          return h('div', type);
        }
      }
      // {
      //   title: '是否政府机构',
      //   key: 'itineraryDate',
      //   width: 120,
      //   align: 'center',
      //   render: (h, params) => {
      //     return h('div', params.row.itineraryDate ? new Date(params.row.itineraryDate).format('yyyy-MM-dd') : '-')
      //   }
      // }
    ],
    '商务会议差旅': [
        // {
        //   type: 'index',
        //   width: 80,
        //   align: 'center',
        //   title: _this.$i18n.t('financeModule.collection.signColumns.index')
        // },
      {
        title: '业务招待类型',
        key: 'type',
        align: 'center',
        width: 120,
        render: (h, params) => {
          return h('div', type);
        }
      },
      {
        title: '差旅类型',
        key: 'travelType',
        align: 'center',
        width: 80,
        render: (h, params) => {
          return h('div', params.row.travelType || '-');
        }
      },
      {
        title: '坐席类型',
        key: 'seat',
        align: 'center',
        width: 80,
        render: (h, params) => {
          return h('div', params.row.seat || '-');
        }
      },
      {
        title: '舱位类型',
        key: 'seatLevel',
        align: 'center',
        width: 80,
        render: (h, params) => {
          return h('div', params.row.seatLevel || '-');
        }
      },
      {
        title: '起始地',
        key: 'startPlace',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.startPlace || '-');
        }
      },
      {
        title: '目的地',
        key: 'destPlace',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.destPlace || '-');
        }
      },
      {
        title: '是否北上广深杭',
        key: 'isBsgsh',
        align: 'center',
        width: 120,
        render: (h, params) => {
          return h('div', params.row.isBsgsh || '-');
        }
      },
      {
        title: '城市名',
        key: 'city',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.city || '-');
        }
      },
      {
        title: '人数',
        key: 'travelNumber',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.travelNumber || '-');
        }
      },
      {
        title: '天数',
        key: 'travelDays',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.travelDays || '-');
        }
      },
      {
        title: '金额',
        key: 'travelAmount',
        align: 'center',
        render: (h, params) => {
          return h('div', params.row.travelAmount.toFixed(_this.quantile) || '-');
        }
      }
    ]
  };
  let result = requisitionColumns[type];
  if (type === '宴请') {
    for (let i = 1; i <= count; i++) {
      let key = 'org' + i;
      result.push({
        title: '机构' + i,
        key,
        align: 'center',
        render: (h, params) => {
          return <div>{params.row[key] || '-'}</div>;
        }
      });
    }
    result.push({
      title: '金额',
      key: 'feastAmount',
      align: 'center',
      render: (h, params) => {
        return <div>{params.row.feastAmount.toFixed(_this.quantile) || '-'}</div>;
      }
    });
  }
  return result;
};

// 关联差旅申请列表
export let relatedTravelApplicationColumns = _this => {
  let relatedTravelApplicationColumns = [
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '差旅单号',
      key: 'receiptNo',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', [
          h(
            'a',
            {
              props: {
                class: 'el-pointer',
                type: 'primary'
              },
              style: {
                marginRight: '5px'
              },
              class: {},
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'baseReceiptInfo',
                    params: {
                      fromPath: 'applicationForm',
                      docId: params.row.receiptNo
                    }
                  });
                }
              }
            },
            params.row.receiptNo || '-'
          )
        ]);
      }
    },
    {
      title: '差旅周期',
      key: 'periodStart',
      align: 'center',
      render: (h, params) => {
        return h(
          'div',
          params.row.periodStart
            ? new Date(params.row.periodStart).format('yyyy-MM-dd') + '---' + new Date(params.row.periodEnd).format('yyyy-MM-dd')
            : '-'
        );
      }
    },
    {
      title: '同行人',
      key: 'participants',
      align: 'center',
      width: 120
    },
    {
      title: '差旅事由',
      key: 'cause',
      align: 'center',
      width: 120
    },
    {
      title: '交通方式',
      key: 'trafficType',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h(
          'div',
          {
            attrs: {
              class: 'mergeTab'
            }
          },
          _this.relatedTravelApplicationDate[params.index].travelItinerarys
            .length !== 0
            ? [
              h(
                  'ul',
                  _this.relatedTravelApplicationDate[params.index].travelItinerarys.map(item => {
                    return h(
                      'li',
                      {},
                      item.trafficType ? item.trafficType : '-'
                    );
                  })
                )
            ]
            : '-'
        );
      }
    },
    {
      title: '差旅行程',
      key: 'fromCity',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h(
          'div',
          {
            attrs: {
              class: 'mergeTab'
            }
          },
          (
            _this.relatedTravelApplicationDate[params.index].travelItinerarys ||
            []
          ).length !== 0
            ? [
              h(
                  'ul',
                  _this.relatedTravelApplicationDate[params.index].travelItinerarys.map((item) => {
                    return h(
                      'li',
                      {},
                      item.fromCity ? item.fromCity + '-' + item.toCity : '-'
                    );
                  })
                )
            ]
            : '-'
        );
      }
    }
  ];
  return relatedTravelApplicationColumns;
};

// 关联申请，国内业务申请单
export let relatedTravelRequisitionColumns = _this => {
  let relatedTravelRequisitionColumns = [
    {
      type: 'index',
      align: 'center',
      width: 50,
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '申请单号',
      key: 'receiptNo',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return h('div', [
          h(
            'a',
            {
              props: {
                class: 'el-pointer',
                type: 'primary'
              },
              style: {
                marginRight: '5px'
              },
              class: {},
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'baseReceiptInfo',
                    params: {
                      fromPath: 'expenseAccount',
                      docId: params.row.receiptNo
                    }
                  });
                }
              }
            },
            params.row.receiptNo || '-'
          )
        ]);
      }
    },
    {
      title: '申请日期',
      key: 'submitTime',
      align: 'center',
      width: 140,
      render: (h, params) => {
        return <div>{params.row.submitTime || '-' }</div>;
      }
    },
    {
      title: '申请备注',
      key: 'cause',
      align: 'center',
      width: 100,
      render: (h, params) => {
        return <div>{params.row.cause || '-' }</div>;
      }
    },
    {
      title: '业务招待类型',
      key: 'entertainType',
      align: 'center',
      width: 100,
      render: (h, params) => {
        return <div>{_.get(params.row, 'entertainDetailVO.entertainType', '-')}</div>;
      }
    },
    {
      title: '详情',
      key: 'details',
      align: 'center',
      render: (h, params) => {
        const entertainDetailVO = _.get(params.row, 'entertainDetailVO', {});
        const keys = requisitionColumns(_this, entertainDetailVO.entertainType, entertainDetailVO.orgCount);
        // 国内业务招待类型单据详情需过滤包含机构+数字的组合的展示
        const type = [ '国内业务招待' ].includes(_this.basicMassege.businessTypeName);
        const re = new RegExp(/^机构(\d+)$/); // 机构开头 数字结尾
        let _arry = _.get(entertainDetailVO, 'detailList', []).map(item => {
          let texts = [];
          keys.filter(key => type ? !re.test(key.title) && !key.title.includes('机构名称') : true).forEach(inner => {
            console.log(item, inner.key, item[inner.key]);
            if (item[inner.key]) {
              texts.push(inner.title + '：' + item[inner.key]);
            }
          });
          return <li title={texts.join('，')} style="white-space: nowrap;text-overflow: ellipsis;">{texts.join('，')}</li>;
        });
        return <div class="mergeTab">
          <ul>
            {_arry}
          </ul>
        </div>;
      }
    }
  ];
  return relatedTravelRequisitionColumns;
};
// 发票信息列表
// 普票
export let invoiceColumnsP = _this => {
  let invoiceColumnsP = [
    {
      type: 'selection',
      width: 50,
      align: 'center'
    },
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: _this.$i18n.t('financeModule.expenseAccount.invoiceColumns.state'),
      key: 'checkStatus',
      align: 'center',
      width: 120,
      render: (h, params) => {
        // console.log(params.row.checkStatus)
        let _arry = [];
        _arry.push(h('Tag', {
          props: { class: 'color-text', color: params.row.checkStatus === 1 ? '#32B5C5' : '#FF525D', type: 'dot' },
          style: {
            'width': '100px',
            'border': 'none!important',
            'background': 'none !important'
          }
        }, params.row.checkStatus === 1 ? '正常' : '异常' || '-'));
        return h('div', _arry);
        // return h('div', params.row.checkStatus === '1' ? '正常' : '异常')
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.imageNumber'
      ),
      key: 'randomCode',
      align: 'center',
      width: 160,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          // debugger
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            [
              h(
                'ul',
                _this.invoiceInformationDate[params.index].imageList.map(
                  (item, randomIndex) => {
                    // console.log(_this.invoiceInformationDate[params.index].imageList)
                    return h('li', {}, [
                      h(
                        'Input',
                        {
                          props: {
                            value: item.randomCode
                          },
                          style: {
                            marginLeft: '10px',
                            marginRight: '10px',
                            width: '140px'
                          },
                          on: {
                            input: (val) => {
                              params.row.imageList[randomIndex].randomCode = val.trim();
                              // _this.invoiceInformationDate[params.index] = params.row
                            }
                          }
                        },
                        item.randomCode
                      ) // 处理
                    ]);
                  }
                )
              )
            ]
          );
        } else {
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            [
              h(
                'ul',
                _this.invoiceInformationDate[params.index].imageList.map(
                  (item) => {
                    return h('li', {}, [
                      h(
                        'a',
                        {
                          props: {
                            type: 'primary'
                          },
                          class: {},
                          style: {
                            // height: '40px',
                            // lineHeight: '40px',
                            cursor: 'pointer',
                            color: '#fc9153'
                          },
                          on: {
                            click: () => {
                              _this.handleClearCurrentRow(
                                params.row,
                                params.index,
                                item
                              );
                            }
                          }
                        },
                        item.randomCode ? item.randomCode : '-'
                      )
                    ]);
                  }
                )
              )
            ]
          );
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.jointNumber'
      ),
      // key: 'invoiceLink',
      align: 'center',
      width: 160,
      render: (h, params) => {
        // 只有增值税普通发票可以编辑联次
        if ((params.row.isFakeMate === 1 || params.row.isFakeMate === 2) && params.row.invoiceType === '04') {
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            [
              h(
                'ul',
                _this.invoiceInformationDate[params.index].imageList.map(
                  (item, randomIndex) => {
                    return h('li', {}, [
                      h(
                        'Select',
                        {
                          attrs: {
                            value: item.isDeduction,
                            transfer: true
                          },
                          style: {
                            marginLeft: '10px',
                            marginRight: '10px',
                            width: '140px'
                          },
                          on: {
                            'on-change': (val) => {
                              params.row.imageList[randomIndex].isDeduction = val;
                            }
                          }
                        },
                        [
                          _this.isDeductionListP.map((val) => {
                            // 下拉框里的内容,optionList下拉框数据
                            return h('Option', {
                              props: {
                                value: val.code,
                                label: val.zValue
                              }
                            });
                          })
                        ]
                      ) // 处理
                    ]);
                  }
                )
              )
            ]
          );
        } else {
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            _this.invoiceInformationDate[params.index].imageList.length !== 0
              ? [
                h(
                    'ul',
                    _this.invoiceInformationDate[params.index].imageList.map(
                      (item) => {
                        return h(
                          'li',
                          {},
                          params.row.invoiceType !== '04' ? '-'
                          : item.isDeduction === 0
                            ? '发票联'
                            : item.isDeduction === 3
                            ? '记账联'
                            : '-'
                        );
                      }
                    )
                  )
              ]
              : '-'
          );
        }
      }
    },
    // {
    //   title: _this.$i18n.t('common.options'),
    //   // key: 'sellerDp',
    //   align: 'center',
    //   width: 90,
    //   // fixed: 'right',
    //   render: (h, params) => {
    //     return h(
    //       'div',
    //       {
    //         attrs: {
    //           class: 'mergeTab'
    //         }
    //       },
    //       [
    //         h(
    //           'ul',
    //           _this.invoiceInformationDate[params.index].imageList.map(
    //             (item, index) => {
    //               return h('li', {}, [
    //                 h(
    //                   'a',
    //                   {
    //                     props: {
    //                       type: 'text'
    //                     },
    //                     class: {},
    //                     attrs: {
    //                       class: 'mergeTab',
    //                       disabled: !(
    //                         params.row.isFakeMate === 1 &&
    //                         _this.invoiceInformationDate[params.index].imageList
    //                           .length > 2
    //                       )
    //                       // disabled: item.handleStatus === 1 && item.referralType === 5
    //                       // style: item.randomCode === '' && params.row.isFakeMate === 0 ? 'display: none' : 'display: inline-block'
    //                     },
    //                     on: {
    //                       click: () => {
    //                         // console.log(index)
    //                         // console.log(item)
    //                         _this.invoiceInformationDate[params.index].imageList.splice(index, 1);
    //                         // _this.deleteImgList(index)
    //                       }
    //                     }
    //                   },
    //                   _this.$i18n.t('common.delete')
    //                 ) // 处理
    //               ]);
    //             }
    //           )
    //         )
    //       ]
    //     );
    //   }
    // },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.billsType'
      ),
      key: 'invoiceType',
      // id: 'printcontent',
      align: 'center',
      width: 150,
      render: (h, params) => {
        // _this.getInvoiceTypeDate()
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          // debugger
          return h('Select', {
            props: {
              value: params.row.invoiceType,
              transfer: true
            },
            on: {
              'on-change': val => {
                if (!val) return;
                // 除增值税普通发票外，其他类型无法选择联次
                params.row.imageList.forEach(l => { l.isDeduction = val === '04' ? 0 : null; });
                params.row.invoiceType = val;
                _this.invoiceInformationDate[params.index] = params.row;
              }
            }
          }, [
            _this.optionList.map((val) => { // 下拉框里的内容,optionList下拉框数据
              return h('Option', {
                props: {
                  value: val.invoiceTypeCode,
                  label: val.invoiceTypeName
                }
              });
            })
          ]);
        } else {
          return h('div', params.row.invoiceType === '04' ? '增值税普通发票'
        : params.row.invoiceType === '10' ? '增值税电子普通发票'
        : params.row.invoiceType === '11' ? '增值税卷式普通发票'
        : params.row.invoiceType === '14' ? '通行费发票'
        : params.row.invoiceType === '15' ? '二手车发票'
        : params.row.invoiceType === '01' ? '增值税专用发票'
        : params.row.invoiceType === '03' ? '机动车发票' : '-');
        }
      }
      // render: (h, params) => {
      //   if (params.row.isFakeMate === 2) {
      //     return h('div', _this.checkSpec === '01' ? '增值税专用发票'
      //   : _this.checkSpec === '10' ? '增值税普通发票'
      //   : _this.checkSpec === '04' ? '增值税普通发票' : '-')
      //   }
        // return h('div', params.row.invoiceType === '01' ? '增值税专用发票'
        // : params.row.invoiceType === '10' ? '增值税普通发票'
        // : params.row.invoiceType === '04' ? '增值税普通发票' : '-')
      // }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.invoiceCode'
      ),
      key: 'invoiceCode',
      align: 'center',
      width: 150,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          return h('Input', {
            props: {
              value: params.row.invoiceCode
            },
            on: {
              input: val => {
                params.row.invoiceCode = val;
                // _this.invoiceInformationDate[params.index] = params.row
              }
            }
          });
        } else {
          return h('div', params.row.invoiceCode);
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.invoiceNumber'
      ),
      key: 'invoiceNumber',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          // if (params.row.isFakeMate === 2 && _this.checkSpec === '01') {
          //   _this.getQuerySpecialDate(params.row)
          // }
          return h('Input', {
            props: {
              value: params.row.invoiceNumber
            },
            on: {
              'input': (val) => {
                params.row.invoiceNumber = val;
                // _this.invoiceInformationDate[params.index] = params.row
              }
            }
          });
        } else {
          return h('div', params.row.invoiceNumber);
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.invoiceRise'
      ),
      key: 'purchaserName',
      align: 'center',
      width: 120
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.lastSixDigitsOfCheckCode'
      ),
      key: 'checkCode',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          if (params.row.isFakeMate === 2 && _this.checkSpec === '01' && params.row.invoiceCode.length > 0 && params.row.invoiceNumber.length > 0 && !params.row.checkCode) {
            return h('Input', {
              props: {
                value: _this.querySpecialDate.checkCode
              },
              on: {
                'on-focus': (val) => {
                  _this.getQuerySpecialDate(params.row);
                },
                input: val => {
                  params.row.checkCode = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          } else {
            return h('Input', {
              props: {
                value: params.row.checkCode
              },
              on: {
                input: val => {
                  params.row.checkCode = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          }
        } else {
          return h('div', params.row.checkCode);
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.Amount'
      ),
      key: 'totalNetAmount',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (!params.row.isFakeMate) {
          return h('div', params.row.totalNetAmount.toFixed(2));
        } else {
          if (params.row.isFakeMate === 2 && _this.checkSpec === '01' && params.row.invoiceCode.length > 0 && params.row.invoiceNumber.length > 0 && !params.row.totalNetAmount) {
            return h('Input', {
              props: {
                // min: 0.00,
                // step: 0.01,
                // precision: 2,
                value: _this.querySpecialDate.totalNetAmount
              },
              on: {
                'on-focus': (val) => {
                  _this.getQuerySpecialDate(params.row);
                },
                'input': (val) => {
                  params.row.totalNetAmount = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          } else {
            return h('InputNumber', {
              props: {
                min: 0.00,
              // step: 0.01,
              // precision: 2,
                value: params.row.totalNetAmount
              },
              on: {
                'input': (val) => {
                  params.row.totalNetAmount = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          }
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.taxAmount'
      ),
      key: 'totalTaxAmount',
      align: 'center',
      width: 90
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.totalPriceAndTax'
      ),
      key: 'totalAmount',
      align: 'center',
      width: 90,
      render: (h, params) => {
        return h('div', params.row.totalAmount ? params.row.totalAmount.toFixed(2) : '-');
      }
    },
    {
      title: _this.$i18n.t('financeModule.expenseAccount.invoiceColumns.invoiceDate'),
      key: 'billingDate',
      align: 'center',
      width: 200,
      render: (h, params) => {
        // debugger
        let myDate = params.row.billingDate ? new Date(params.row.billingDate).format('yyyy-MM-dd hh:mm:ss') : '';
        // console.log(new Date(params.row.billingDate).format('yyyy-MM-dd hh:mm:ss'))
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          if (params.row.isFakeMate === 2 && _this.checkSpec === '01' && params.row.invoiceCode.length > 0 && params.row.invoiceNumber.length > 0 && !params.row.billingDate) {
            let myDate = _this.querySpecialDate.billingDate ? new Date(_this.querySpecialDate.billingDate).format('yyyy-MM-dd hh:mm:ss') : '';
            return h('DatePicker', {
              props: {
                value: myDate,
                type: 'datetime',
                format: 'yyyy-MM-dd',
                // placement: 'bottom',
                transfer: true
              },
              on: {
                // 'on-focus': (val) => {
                //   _this.getQuerySpecialDate(params.row)
                // },
                'on-change': (val) => {
                  params.row.billingDate = val;
                  // console.log(params.row.billingDate)
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          } else {
            return h('DatePicker', {
              props: {
                value: myDate,
                type: 'datetime',
                format: 'yyyy-MM-dd',
                transfer: true
              },
              on: {
                'on-change': (val) => {
                  // debugger
                  // myDate = val
                  params.row.billingDate = val;
                  // console.log(new Date(params.row.billingDate).format('yyyy-MM-dd hh:mm:ss'))
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          }
        } else {
          return h('div', params.row.billingDate ? new Date(params.row.billingDate).format('yyyy-MM-dd') : '-');
        }
      }
    },
    // {
    //   title: _this.$i18n.t(
    //     'financeModule.expenseAccount.invoiceColumns.jointNumber'
    //   ),
    //   key: 'invoiceLink',
    //   align: 'center',
    //   width: 90
    // },
    // {
    //   title: _this.$i18n.t('financeModule.expenseAccount.invoiceColumns.isAccreditation'),
    //   key: 'authVerifyStatus',
    //   align: 'center',
    //   // width: _this.checkSpec === '04' ? 0 : 120,
    //   width: 90,
    //   render: (h, params) => {
    //     // params.row.invoiceType === '04' ? width = 0 : width = 90
    //     // let _row = params.row
    //     return h('i-switch', {
    //       attrs: {
    //         disabled: !!_this.isRead,
    //         style: _this.checkSpec === '04' ? 'display: none' : 'display: inline-block'
    //       },
    //       props: {
    //         // 这里可以设置它的属性
    //         value: !!params.row.authVerifyStatus // 设置它的值比如：true或false
    //       },
    //       on: {
    //         // 操作事件
    //         'on-change': function () {
    //           // 值发生了改变调用方法
    //           if (params.row.authVerifyStatus === 1) {
    //             params.row.authVerifyStatus = 0
    //           } else {
    //             params.row.authVerifyStatus = 1
    //           }
    //           _this.attestation(params.row)
    //         }
    //       }
    //     })
    //   }
    // },
    {
      title: '发票开具城市',
      minWidth: 160,
      key: 'provideCity',
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          return h('Input', {
            props: {
              value: params.row.provideCity
            },
            on: {
              input: (val) => {
                params.row.provideCity = val.trim();
                _this.invoiceInformationDate[params.index] = params.row;
              }
            }
          });
        } else {
          return h('div', params.row.provideCity || '-');
        }
      }
    },
    {
      width: 100,
      align: 'center',
      title: '是否合规',
      render: (h, params) => {
        return h('i-switch', {
          props: {
            value: params.row.isCompliance === '1' ? '1' : '0',
            disabled: !(params.row.isFakeMate === 1 || params.row.isFakeMate === 2)
          },
          attrs: {
            'true-value': '1',
            'false-value': '0'
          },
          on: {
            'on-change': val => {
              params.row.isCompliance = val;
              _this.invoiceInformationDate[params.index] = params.row;
            }
          }
        });
      }
    },
    {
      title: _this.$i18n.t('financeModule.collection.signColumns.operation'),
      key: 'sellerDp',
      align: 'center',
      width: 180,
      fixed: 'right',
      render: (h, params) => {
        if (_this.isRead) {
          return h('div');
        }
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          return h('div', [
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {
                  'table-save-text-btn': params.row._prevSecondLoading
                },
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    // console.log('保存', 11111)
                    _this.$set(params.row, '_prevSecondLoading', true);
                    if (params.row.isFakeMate === 1) {
                      // params.row.isFakeMate = 0
                      _this.editInvoice2.billingDate = params.row.billingDate;
                      _this.editInvoice2.checkCode = params.row.checkCode;
                      _this.editInvoice2.invoiceCode = params.row.invoiceCode;
                      _this.editInvoice2.imageRandomCode = params.row.imageRandomCode;
                      _this.editInvoice2.invoiceNumber = params.row.invoiceNumber;
                      _this.editInvoice2.totalNetAmount = params.row.totalNetAmount;
                      _this.editInvoice2.invoiceType = params.row.invoiceType;
                      _this.editInvoice2.isCompliance = params.row.isCompliance;
                      _this.editInvoice2.imageList = params.row.imageList;
                      _this.editInvoice2.provideCity = params.row.provideCity;
                      _this.editInvoice2.remarkTransAmount =
                        params.row.remarkTransAmount;
                      let result = _this.savaInput2(params.row, params.index);
                      if (!result) params.row._prevSecondLoading = false;
                      if (result && typeof result.then === 'function') {
                        result.then(() => (params.row._prevSecondLoading = false));
                      }
                    } else if (params.row.isFakeMate === 2) {
                      // // params.row.isFakeMate = 0
                      // console.log(new Date(params.row.billingDate).format('yyyy-MM-dd hh:mm:ss'))
                      _this.addInvoiceD.billingDate = params.row.billingDate;
                      _this.addInvoiceD.checkCode = params.row.checkCode;
                      _this.addInvoiceD.invoiceCode = params.row.invoiceCode;
                      _this.addInvoiceD.imageRandomCode = params.row.imageRandomCode;
                      _this.addInvoiceD.invoiceNumber = params.row.invoiceNumber;
                      _this.addInvoiceD.totalNetAmount = params.row.totalNetAmount;
                      _this.addInvoiceD.invoiceType = params.row.invoiceType;
                      _this.addInvoiceD.imageList = [ ...params.row.imageList ];
                      _this.addInvoiceD.isCompliance = params.row.isCompliance;
                      _this.addInvoiceD.imageList = params.row.imageList;
                      _this.addInvoiceD.provideCity = params.row.provideCity;
                      _this.addInvoiceD.remarkTransAmount =
                        params.row.remarkTransAmount;
                      let result = _this.addNewrowSave();
                      if (!result) params.row._prevSecondLoading = false;
                      if (result && typeof result.then === 'function') {
                        result.then(() => (params.row._prevSecondLoading = false));
                      }
                    }
                  }
                }
              },
              _this.$i18n.t('common.save')
            ),
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {},
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    _this.getInvoiceInformationDate();
                    // console.log(params.row.isFakeMate)
                    _this.addnewLoading = false;
                    if (_this.invoiceInformationDate[0].isFakeMate === 2) {
                      _this.invoiceInformationDate.shift();
                    } else if (params.row.isFakeMate === 1) {
                      // params.row.isFakeMate = 0
                      _this.invoiceInformationDate[params.index].isFakeMate = 0;
                      _this.$set(params.row, 'isFakeMate', 0);
                      _this.editDetailsArr2.forEach(function (item, index) {
                        var _item = JSON.parse(item);
                        // if (_this.invoiceInformationDate[params.index].key === _item.key) {
                          // _this.$set(params.row, 'isFakeMate', 0)
                        _this.invoiceInformationDate[params.index].billingDate = _item.billingDate;
                        _this.invoiceInformationDate[params.index].checkCode = _item.checkCode;
                        _this.invoiceInformationDate[params.index].invoiceCode = _item.invoiceCode;
                        _this.invoiceInformationDate[params.index].imageRandomCode = _item.imageRandomCode;
                        _this.invoiceInformationDate[params.index].invoiceNumber = _item.invoiceNumber;
                        _this.invoiceInformationDate[params.index].totalNetAmount = _item.totalNetAmount;
                        _this.invoiceInformationDate[params.index].invoiceType = _item.invoiceType;
                        console.log('取消之前' + _this.editDetailsArr2);
                        console.log('取消之前' + _item);
                        _this.editDetailsArr2.splice(index, 1);
                        // }
                        console.log('取消之前' + _this.editDetailsArr2);
                      });
                      // _this.$set(params.row, 'isFakeMate', 0)
                    }
                  }
                }
              }, '取消')
          ]);
        } else {
          return h('div', [
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {},
                on: {
                  click: () => {
                    _this.checkInvoice('one', params.row);
                  }
                }
              }, _this.$i18n.t('financeModule.expenseAccount.invoiceColumns.inspection')),
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {},
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    // _this.invoiceInformationDate[params.index].key = 'key' + params.index
                    _this.zifu2 = JSON.stringify(_this.invoiceInformationDate[params.index]);
                    _this.editDetailsArr2.push(_this.zifu2);
                    params.row.isFakeMate = 1; // 1编辑 2添加
                    _this.invoiceInformationDate[params.index].isFakeMate = params.row.isFakeMate;
                    // _this.$set(params.row, 'isFakeMate', 1)
                    // _this.invoiceInformationDate[params.index].isFakeMate = params.row.isFakeMate
                  }
                }
              }, _this.$i18n.t('common.edit')),
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {},
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    // console.log(params.row.invoiceId)
                    _this.delSubject.invoiceId = params.row.invoiceId;
                    _this.confirmDel(_this.delSubject);
                  }
                }
              }, _this.$i18n.t('common.delete'))
          ]);
        }
      }
    }
  ];
  return invoiceColumnsP;
};
// 专票
export let invoiceColumnsZ = _this => {
  let invoiceColumnsZ = [
    {
      type: 'selection',
      width: 50,
      align: 'center'
    },
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: _this.$i18n.t('financeModule.expenseAccount.invoiceColumns.state'),
      key: 'checkStatus',
      align: 'center',
      width: 120,
      render: (h, params) => {
        // console.log(params.row.checkStatus)
        let _arry = [];
        _arry.push(
          h(
            'Tag',
            {
              props: {
                class: 'color-text',
                color: params.row.checkStatus === 1 ? '#32B5C5' : '#FF525D',
                type: 'dot'
              },
              style: {
                width: '100px',
                border: 'none!important',
                background: 'none !important'
              }
            },
            params.row.checkStatus === 1 ? '正常' : '异常' || '-'
          )
        );
        return h('div', _arry);
        // return h('div', params.row.checkStatus === '1' ? '正常' : '异常')
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.imageNumber'
      ),
      key: 'randomCode',
      align: 'center',
      width: 160,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          // debugger
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            [
              h(
                'ul',
                _this.invoiceInformationDate[params.index].imageList.map(
                  (item) => {
                    // console.log(_this.invoiceInformationDate[params.index].imageList)
                    return h('li', {}, [
                      h(
                        'Input',
                        {
                          props: {
                            value: item.randomCode
                          },
                          style: {
                            marginLeft: '10px',
                            marginRight: '10px',
                            width: '140px'
                          },
                          on: {
                            'on-blur': (e) => {
                              item.randomCode = e.target.value;
                              // console.log(val)
                              // _this.invoiceInformationDate[params.index] = params.row
                            }
                          }
                        },
                        item.randomCode
                      ) // 处理
                    ]);
                  }
                )
              )
            ]
          );
        } else {
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            [
              h(
                'ul',
                _this.invoiceInformationDate[params.index].imageList.map(
                  (item) => {
                    return h('li', {}, [
                      h(
                        'a',
                        {
                          props: {
                            type: 'primary'
                          },
                          class: {},
                          style: {
                            // height: '40px',
                            // lineHeight: '40px',
                            cursor: 'pointer',
                            color: '#fc9153'
                          },
                          on: {
                            click: () => {
                              _this.handleClearCurrentRow(
                                params.row,
                                params.index,
                                item
                              );
                            }
                          }
                        },
                        item.randomCode ? item.randomCode : '-'
                      )
                    ]);
                  }
                )
              )
            ]
          );
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.jointNumber'
      ),
      // key: 'invoiceLink',
      align: 'center',
      width: 160,
      render: (h, params) => {
        if ((params.row.isFakeMate === 1 || params.row.isFakeMate === 2) && params.row.invoiceType !== '08') {
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            [
              h(
                'ul',
                _this.invoiceInformationDate[params.index].imageList.map(
                  (item, randomIndex) => {
                    return h('li', {}, [
                      h(
                        'Select',
                        {
                          attrs: {
                            value: item.isDeduction,
                            transfer: true
                          },
                          style: {
                            marginLeft: '10px',
                            marginRight: '10px',
                            width: '140px'
                          },
                          on: {
                            'on-change': (val) => {
                              // 修复联次修改时 触发票据种类清空bug
                              params.row.imageList[randomIndex].isDeduction = val;
                            }
                          }
                        },
                        [
                          _this.isDeductionList.map((val) => {
                            // 下拉框里的内容,optionList下拉框数据
                            return h('Option', {
                              props: {
                                value: val.code,
                                label: val.zValue
                              }
                            });
                          })
                        ]
                      ) // 处理
                    ]);
                  }
                )
              )
            ]
          );
        } else {
          return h(
            'div',
            {
              attrs: {
                class: 'mergeTab'
              }
            },
            _this.invoiceInformationDate[params.index].imageList.length !== 0
              ? [
                h(
                    'ul',
                    _this.invoiceInformationDate[params.index].imageList.map(
                      (item) => {
                        return h(
                          'li',
                          {},
                          params.row.invoiceType === '08' ? '-'
                          : item.isDeduction === 0
                            ? '发票联'
                            : item.isDeduction === 1
                            ? '抵扣联'
                            : item.isDeduction === 2
                            ? '报税联'
                            : item.isDeduction === 3
                            ? '记账联'
                            : '-'
                        );
                      }
                    )
                  )
              ]
              : '-'
          );
        }
      }
    },
    {
      title: _this.$i18n.t('common.options'),
      // key: 'sellerDp',
      align: 'center',
      width: 90,
      // fixed: 'right',
      render: (h, params) => {
        return h(
          'div',
          {
            attrs: {
              class: 'mergeTab'
            }
          },
          [
            h(
              'ul',
              _this.invoiceInformationDate[params.index].imageList.map(
                (item, index) => {
                  return h('li', {}, [
                    h(
                      'a',
                      {
                        props: {
                          type: 'text'
                        },
                        class: {},
                        attrs: {
                          class: 'mergeTab',
                          disabled: !(
                            params.row.isFakeMate === 1 &&
                            _this.invoiceInformationDate[params.index].imageList
                              .length > 2
                          )
                          // disabled: item.handleStatus === 1 && item.referralType === 5
                          // style: item.randomCode === '' && params.row.isFakeMate === 0 ? 'display: none' : 'display: inline-block'
                        },
                        on: {
                          click: () => {
                            // console.log(index)
                            // console.log(item)
                            _this.invoiceInformationDate[params.index].imageList.splice(index, 1);
                            // _this.deleteImgList(index)
                          }
                        }
                      },
                      _this.$i18n.t('common.delete')
                    ) // 处理
                  ]);
                }
              )
            )
          ]
        );
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.billsType'
      ),
      key: 'invoiceType',
      // id: 'printcontent',
      align: 'center',
      width: 150,
      render: (h, params) => {
        // _this.getInvoiceTypeDate()
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          // debugger
          return h(
            'Select',
            {
              // props: {
              //   value: params.row.invoiceType
              // // size: 'small'
              // },
              attrs: {
                value: params.row.invoiceType,
                transfer: true
              },
              on: {
                'on-change': (val) => {
                  params.row.invoiceType = val;
                  // 由两个改成一个
                  if (val === '08' && params.row.imageList.length > 1) { // 增值税专用发票只存在一个影像编号 且没有联次
                    params.row.imageList = [ { 'randomCode': '', 'isDeduction': '' } ];
                  }

                  // 由一个变成两个
                  if (val !== '08' && params.row.imageList.length === 1) {
                    params.row.imageList = [ { 'randomCode': '', 'isDeduction': '' },
                      { 'randomCode': '', 'isDeduction': '' } ];
                  }
                  _this.invoiceInformationDate[params.index] = params.row;
                  _this.invoiceInformationDate = [ ..._this.invoiceInformationDate ]; // 触发数据更新
                }
              }
            },
            [
              _this.optionList.map((val) => {
                // 下拉框里的内容,optionList下拉框数据
                return h('Option', {
                  props: {
                    value: val.invoiceTypeCode,
                    label: val.invoiceTypeName
                  }
                });
              })
            ]
          );
        } else {
          return h(
            'div',
            params.row.invoiceType === '04'
              ? '增值税普通发票'
              : params.row.invoiceType === '10'
              ? '增值税电子普通发票'
              : params.row.invoiceType === '11'
              ? '增值税卷式普通发票'
              : params.row.invoiceType === '14'
              ? '通行费发票'
              : params.row.invoiceType === '15'
              ? '二手车发票'
              : params.row.invoiceType === '01'
              ? '增值税专用发票'
              : params.row.invoiceType === '03'
              ? '机动车发票'
              : params.row.invoiceType === '08'
              ? '增值税电子专用发票'
              : '-'
          );
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.invoiceCode'
      ),
      key: 'invoiceCode',
      align: 'center',
      width: 150,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          return h('Input', {
            props: {
              value: params.row.invoiceCode
            },
            on: {
              input: (val) => {
                params.row.invoiceCode = val;
                // _this.invoiceInformationDate[params.index] = params.row
              }
            }
          });
        } else {
          return h('div', params.row.invoiceCode);
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.invoiceNumber'
      ),
      key: 'invoiceNumber',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          // if (params.row.isFakeMate === 2 && _this.checkSpec === '01') {
          //   _this.getQuerySpecialDate(params.row)
          // }
          return h('Input', {
            props: {
              value: params.row.invoiceNumber
            },
            on: {
              input: (val) => {
                params.row.invoiceNumber = val;
                // _this.invoiceInformationDate[params.index] = params.row
              }
            }
          });
        } else {
          return h('div', params.row.invoiceNumber);
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.invoiceRise'
      ),
      key: 'purchaserName',
      align: 'center',
      width: 120
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.lastSixDigitsOfCheckCode'
      ),
      key: 'checkCode',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          if (
            params.row.isFakeMate === 2 &&
            _this.checkSpec === '01' &&
            params.row.invoiceCode.length > 0 &&
            params.row.invoiceNumber.length > 0 &&
            !params.row.checkCode
          ) {
            return h('Input', {
              props: {
                value: _this.querySpecialDate.checkCode
              },
              on: {
                'on-focus': (val) => {
                  _this.getQuerySpecialDate(params.row);
                },
                input: (val) => {
                  params.row.checkCode = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          } else {
            return h('Input', {
              props: {
                value: params.row.checkCode
              },
              on: {
                input: (val) => {
                  params.row.checkCode = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          }
        } else {
          return h('div', params.row.checkCode);
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.Amount'
      ),
      key: 'totalNetAmount',
      align: 'center',
      width: 120,
      render: (h, params) => {
        if (!params.row.isFakeMate) {
          return h('div', params.row.totalNetAmount.toFixed(2));
        } else {
          if (
            params.row.isFakeMate === 2 &&
            _this.checkSpec === '01' &&
            params.row.invoiceCode.length > 0 &&
            params.row.invoiceNumber.length > 0 &&
            !params.row.totalNetAmount
          ) {
            return h('Input', {
              props: {
                // min: 0.00,
                // step: 0.01,
                // precision: 2,
                value: _this.querySpecialDate.totalNetAmount
              },
              on: {
                'on-focus': (val) => {
                  _this.getQuerySpecialDate(params.row);
                  // console.log(params.row.totalNetAmount)
                },
                input: (val) => {
                  params.row.totalNetAmount = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          } else {
            return h('InputNumber', {
              props: {
                min: 0.0,
                // step: 0.01,
                // precision: 2,
                value: params.row.totalNetAmount
              },
              on: {
                input: (val) => {
                  params.row.totalNetAmount = val;
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          }
        }
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.taxAmount'
      ),
      key: 'totalTaxAmount',
      align: 'center',
      width: 90
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.totalPriceAndTax'
      ),
      key: 'totalAmount',
      align: 'center',
      width: 90,
      render: (h, params) => {
        return h(
          'div',
          params.row.totalAmount ? params.row.totalAmount.toFixed(2) : '-'
        );
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.invoiceColumns.invoiceDate'
      ),
      key: 'billingDate',
      align: 'center',
      width: 200,
      render: (h, params) => {
        // debugger
        let myDate = params.row.billingDate
          ? new Date(params.row.billingDate).format('yyyy-MM-dd hh:mm:ss')
          : '';
        // console.log(new Date(params.row.billingDate).format('yyyy-MM-dd hh:mm:ss'))
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          if (
            params.row.isFakeMate === 2 &&
            _this.checkSpec === '01' &&
            params.row.invoiceCode.length > 0 &&
            params.row.invoiceNumber.length > 0 &&
            !params.row.billingDate
          ) {
            let myDate = _this.querySpecialDate.billingDate
              ? new Date(_this.querySpecialDate.billingDate).format(
                  'yyyy-MM-dd hh:mm:ss'
                )
              : '';
            return h('DatePicker', {
              props: {
                value: myDate,
                type: 'datetime',
                format: 'yyyy-MM-dd',
                transfer: true
              },
              on: {
                // 'on-focus': (val) => {
                //   _this.getQuerySpecialDate(params.row)
                // },
                'on-change': (val) => {
                  params.row.billingDate = val;
                  // console.log(params.row.billingDate)
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          } else {
            return h('DatePicker', {
              props: {
                value: myDate,
                type: 'datetime',
                format: 'yyyy-MM-dd',
                transfer: true
              },
              on: {
                'on-change': (val) => {
                  // debugger
                  // myDate = val
                  params.row.billingDate = val;
                  console.log(
                    new Date(params.row.billingDate).format(
                      'yyyy-MM-dd hh:mm:ss'
                    )
                  );
                  _this.invoiceInformationDate[params.index] = params.row;
                }
              }
            });
          }
        } else {
          return h(
            'div',
            params.row.billingDate
              ? new Date(params.row.billingDate).format('yyyy-MM-dd')
              : '-'
          );
        }
      }
    },
    {
      title: '发票开具城市',
      minWidth: 160,
      key: 'provideCity',
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          return h('Input', {
            props: {
              value: params.row.provideCity
            },
            on: {
              input: (val) => {
                params.row.provideCity = val.trim();
                _this.invoiceInformationDate[params.index] = params.row;
              }
            }
          });
        } else {
          return h('div', params.row.provideCity || '-');
        }
      }
    },
    // {
    //   title: _this.$i18n.t('financeModule.expenseAccount.invoiceColumns.isAccreditation'),
    //   key: 'authVerifyStatus',
    //   align: 'center',
    //   // width: _this.checkSpec === '04' ? 0 : 120,
    //   width: 90,
    //   render: (h, params) => {
    //     // params.row.invoiceType === '04' ? width = 0 : width = 90
    //     // let _row = params.row
    //     return h('i-switch', {
    //       attrs: {
    //         disabled:
    //           // 单据类型为报销单，业务类型为荣誉激励报销单、业务招待报销单、俱乐部报销单、定额费用报销单、木吉公益报销单都会默认不认证、不可修改
    //           !!_this.isRead ||
    //           (_this.basicMassege.receiptType === '报销单' &&
    //             [
    //               '荣誉激励',
    //               '业务招待',
    //               '俱乐部',
    //               '定额费用',
    //               '木吉公益'
    //             ].indexOf(_this.basicMassege.businessType) !== -1),
    //         style:
    //           _this.checkSpec === '04'
    //             ? 'display: none'
    //             : 'display: inline-block'
    //       },
    //       props: {
    //         // 这里可以设置它的属性
    //         value: !!params.row.authVerifyStatus // 设置它的值比如：true或false
    //       },
    //       on: {
    //         // 操作事件
    //         'on-change': function () {
    //           // 值发生了改变调用方法
    //           if (params.row.authVerifyStatus === 1) {
    //             params.row.authVerifyStatus = 0
    //           } else {
    //             params.row.authVerifyStatus = 1
    //           }
    //           _this.attestation(params.row)
    //         }
    //       }
    //     })
    //   }
    // },
    {
      title: '备注转出额',
      key: 'remarkTransAmount',
      align: 'center',
      width: 90,
      render: (h, params) => {
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          return h('InputNumber', {
            props: {
              value: params.row.remarkTransAmount
            },
            on: {
              input: (val) => {
                params.row.remarkTransAmount = val;
                _this.invoiceInformationDate[params.index] = params.row;
              }
            }
          });
        } else {
          return h('div', params.row.remarkTransAmount);
        }
      }
    },
    {
      title: '#E税额',
      key: 'eTaxAmount',
      align: 'center',
      width: 90,
      render: (h, params) => {
        // #E税额编辑：当票据种类为增值税专用发票和增值税电子专用发票时，该字段可以编辑并输入
        if ([ 1, 2 ].includes(params.row.isFakeMate) && [ '01', '08' ].includes(params.row.invoiceType)) {
          return h('InputNumber', {
            props: {
              value: params.row.eTaxAmount || 0
            },
            on: {
              input: (val) => {
                params.row.eTaxAmount = val;
                _this.invoiceInformationDate[params.index] = params.row;
              }
            }
          });
        } else {
          return h('div', params.row.eTaxAmount);
        }
      }
    },
    {
      width: 100,
      align: 'center',
      title: '是否合规',
      render: (h, params) => {
        return h('i-switch', {
          props: {
            value: params.row.isCompliance === '1' ? '1' : '0',
            disabled: !(params.row.isFakeMate === 1 || params.row.isFakeMate === 2)
          },
          attrs: {
            'true-value': '1',
            'false-value': '0'
          },
          on: {
            'on-change': val => {
              params.row.isCompliance = val;
              _this.invoiceInformationDate[params.index] = params.row;
            }
          }
        });
      }
    },
    {
      title: _this.$i18n.t('financeModule.collection.signColumns.operation'),
      key: 'sellerDp',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (h, params) => {
        if (_this.isRead) {
          return h('div');
        }
        if (params.row.isFakeMate === 1 || params.row.isFakeMate === 2) {
          return h('div', [
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {
                  'table-save-text-btn': params.row._prevSecondLoading
                },
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    console.log('保存');

                    _this.$set(params.row, '_prevSecondLoading', true);
                    if (params.row.isFakeMate === 1) {
                      // params.row.isFakeMate = 0
                      _this.editInvoice2.billingDate = params.row.billingDate;
                      _this.editInvoice2.checkCode = params.row.checkCode;
                      _this.editInvoice2.invoiceCode = params.row.invoiceCode;
                      _this.editInvoice2.imageRandomCode =
                        params.row.imageRandomCode;
                      _this.editInvoice2.invoiceNumber =
                        params.row.invoiceNumber;
                      _this.editInvoice2.totalNetAmount =
                        params.row.totalNetAmount;
                      _this.editInvoice2.invoiceType = params.row.invoiceType;
                      _this.editInvoice2.imageList = [ ...params.row.imageList ];
                      _this.editInvoice2.isCompliance = params.row.isCompliance;
                      _this.editInvoice2.provideCity = params.row.provideCity;
                      _this.editInvoice2.remarkTransAmount =
                        params.row.remarkTransAmount;

                      let result = _this.savaInput2(params.row, params.index);
                      if (!result) params.row._prevSecondLoading = false;
                      if (result && typeof result.then === 'function') {
                        result.then(
                          () => (params.row._prevSecondLoading = false)
                        );
                      }
                    } else if (params.row.isFakeMate === 2) {
                      // // params.row.isFakeMate = 0
                      // console.log(new Date(params.row.billingDate).format('yyyy-MM-dd hh:mm:ss'))
                      _this.addInvoiceD.billingDate = params.row.billingDate;
                      _this.addInvoiceD.checkCode = params.row.checkCode;
                      _this.addInvoiceD.invoiceCode = params.row.invoiceCode;
                      _this.addInvoiceD.imageRandomCode =
                        params.row.imageRandomCode;
                      _this.addInvoiceD.invoiceNumber =
                        params.row.invoiceNumber;
                      _this.addInvoiceD.totalNetAmount =
                        params.row.totalNetAmount;
                      _this.addInvoiceD.invoiceType = params.row.invoiceType;
                      _this.addInvoiceD.imageList = [ ...params.row.imageList ];
                      _this.addInvoiceD.isCompliance = params.row.isCompliance;
                      _this.addInvoiceD.provideCity = params.row.provideCity;
                      _this.addInvoiceD.remarkTransAmount =
                        params.row.remarkTransAmount;
                      let result = _this.addNewrowSave();
                      if (!result) params.row._prevSecondLoading = false;
                      if (result && typeof result.then === 'function') {
                        result.then(
                          () => (params.row._prevSecondLoading = false)
                        );
                      }
                    }
                  }
                }
              },
              _this.$i18n.t('common.save')
            ),
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {},
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    _this.getInvoiceInformationDate();
                    // console.log(params.row.isFakeMate)
                    _this.addnewLoading = false;
                    if (_this.invoiceInformationDate[0].isFakeMate === 2) {
                      _this.invoiceInformationDate.shift();
                    } else if (params.row.isFakeMate === 1) {
                      // params.row.isFakeMate = 0
                      _this.invoiceInformationDate[params.index].isFakeMate = 0;
                      _this.$set(params.row, 'isFakeMate', 0);
                      _this.editDetailsArr2.forEach(function (item, index) {
                        var _item = JSON.parse(item);
                        // if (_this.invoiceInformationDate[params.index].key === _item.key) {
                        // _this.$set(params.row, 'isFakeMate', 0)
                        _this.invoiceInformationDate[params.index].billingDate =
                          _item.billingDate;
                        _this.invoiceInformationDate[params.index].checkCode =
                          _item.checkCode;
                        _this.invoiceInformationDate[params.index].invoiceCode =
                          _item.invoiceCode;
                        _this.invoiceInformationDate[params.index].imageRandomCode = _item.imageRandomCode;
                        _this.invoiceInformationDate[params.index].invoiceNumber = _item.invoiceNumber;
                        _this.invoiceInformationDate[params.index].totalNetAmount = _item.totalNetAmount;
                        _this.invoiceInformationDate[params.index].invoiceType =
                          _item.invoiceType;
                        _this.invoiceInformationDate[params.index].imageList =
                          _item.imageList;
                        _this.invoiceInformationDate[params.index].remarkTransAmount = _item.remarkTransAmount;
                        _this.invoiceInformationDate[params.index].isCompliance = _item.isCompliance;
                        console.log('取消之前' + _this.editDetailsArr2);
                        console.log('取消之前' + _item);
                        _this.editDetailsArr2.splice(index, 1);
                        // }
                        console.log('取消之前' + _this.editDetailsArr2);
                      });
                      // _this.$set(params.row, 'isFakeMate', 0)
                    }
                  }
                }
              },
              '取消'
            )
          ]);
        } else {
          return h('div', [
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {
                  'table-save-text-btn': params.row._prevSecondLoading
                },
                on: {
                  click: () => {
                    _this.checkInvoice('one', params.row);
                  }
                }
              },
              _this.$i18n.t(
                'financeModule.expenseAccount.invoiceColumns.inspection'
              )
            ),
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {
                  'table-save-text-btn': params.row._prevSecondLoading
                },
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    // _this.invoiceInformationDate[params.index].key = 'key' + params.index
                    _this.zifu2 = JSON.stringify(
                      _this.invoiceInformationDate[params.index]
                    );
                    _this.editDetailsArr2.push(_this.zifu2);
                    params.row.isFakeMate = 1; // 1编辑 2添加
                    _this.invoiceInformationDate[params.index].isFakeMate =
                      params.row.isFakeMate;
                    // _this.$set(params.row, 'isFakeMate', 1)
                    // _this.invoiceInformationDate[params.index].isFakeMate = params.row.isFakeMate
                  }
                }
              },
              _this.$i18n.t('common.edit')
            ),
            h(
              'a',
              {
                props: {
                  type: 'primary'
                },
                class: {
                  'table-save-text-btn': params.row._prevSecondLoading
                },
                style: {
                  marginLeft: '20px'
                },
                on: {
                  click: () => {
                    _this.delSubject.invoiceId = params.row.invoiceId;
                    _this.confirmDel(_this.delSubject);
                  }
                }
              },
              _this.$i18n.t('common.delete')
            ),
            [ '08', '01' ].includes(params.row.invoiceType) &&
            h('p', { style: 'text-align: center' }, [
              h(
                'a',
                {
                  props: {
                    type: 'primary'
                  },
                  class: {
                    'table-save-text-btn': params.row._prevSecondLoading
                  },
                  on: {
                    // 一键转出 =》 自动将税额补充到备注转出额中 且执行保存
                    click: () => {
                      _this.$set(params.row, '_prevSecondLoading', true);
                      // 税额 ==> totalTaxAmount 备注转出额 ==> remarkTransAmount
                      // 直接复用原来的保存方法
                      _this.editInvoice2.billingDate = params.row.billingDate;
                      _this.editInvoice2.checkCode = params.row.checkCode;
                      _this.editInvoice2.invoiceCode = params.row.invoiceCode;
                      _this.editInvoice2.imageRandomCode =
                        params.row.imageRandomCode;
                      _this.editInvoice2.invoiceNumber =
                        params.row.invoiceNumber;
                      _this.editInvoice2.totalNetAmount =
                        params.row.totalNetAmount;
                      _this.editInvoice2.invoiceType = params.row.invoiceType;
                      _this.editInvoice2.imageList = [ ...params.row.imageList ];
                      _this.editInvoice2.isCompliance = params.row.isCompliance;
                      _this.editInvoice2.remarkTransAmount =
                        params.row.totalTaxAmount;
                      let result = _this.savaInput2(params.row, params.index);
                      if (!result) params.row._prevSecondLoading = false;
                      if (result && typeof result.then === 'function') {
                        result.then(
                          () => (params.row._prevSecondLoading = false)
                        );
                      }
                    }
                  }
                }, '一键转出'
              )
            ])
          ]);
        }
      }
    }
  ];
  return invoiceColumnsZ;
};

// 规则执行结果列表
export let ruleExecutionResultColumns = _this => {
  let ruleExecutionResultColumns = [
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.ruleExecutionResultColumns.contrastRule'
      ),
      key: 'condName',
      align: 'center'
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.ruleExecutionResultColumns.enforcementResults'
      ),
      key: 'condResult',
      align: 'center',
      render: (h, params) => {
        let _arry = [];
        _arry.push(h('Tag', {
          props: { class: 'color-text', color: params.row.condResult === 0 ? '#FF525D' : '#32B5C5', type: 'dot' },
          style: {
            'width': '100px',
            'border': 'none!important',
            'background': 'none !important'
          }
        }, params.row.condResult === 0 ? '未通过'
        : params.row.condResult === 1 ? '已通过' : '-'));
        return h('div', _arry);
        // return h('div', params.row.printStatus || '-')
      }
    }
      // render: (h, params) => {
      //   return h('div', params.row.condResult === 0 ? '未通过'
      //   : params.row.condResult === 1 ? '已通过' : '-')
      // }
  ];
  return ruleExecutionResultColumns;
};
// 线上流程
export let onlineProcessColumns = _this => {
  let onlineProcessColumns = [
    {
      title: '操作时间',
      key: 'actionTime',
      align: 'center',
      render: (h, params) => {
        if (params.row.tag === 1) {
          return h('div', {
            style: {
              // height: '40px',
              // lineHeight: '40px',
              // cursor: 'pointer',
              color: '#fc9153'
            }
          }, params.row.actionTime ? new Date(params.row.actionTime).format('yyyy-MM-dd hh:mm:ss') : '-');
        } else {
          return h('div', params.row.actionTime ? new Date(params.row.actionTime).format('yyyy-MM-dd hh:mm:ss') : '-');
        }
      }
    },
    {
      title: '操作类型',
      key: 'actionType',
      align: 'center',
      render: (h, params) => {
        // let _this = this
        if (params.row.tag === 1) {
          return h('div', {
            style: {
              // height: '40px',
              // lineHeight: '40px',
              // cursor: 'pointer',
              color: '#fc9153'
            }
          }, params.row.actionType || 0);
        } else {
          return h('div', params.row.actionType || 0);
        }
      }
    },
    {
      title: '操作人',
      key: 'handleUserName',
      align: 'center',
      // width: 150,
      render: (h, params) => {
        console.log(params.row);
        if (params.row.tag === 1) {
          return h('div', {
            style: {
              // height: '40px',
              // lineHeight: '40px',
              // cursor: 'pointer',
              color: '#fc9153'
            }
          }, params.row.handleUser + params.row.handleUserName || '-');
        } else {
          return h('div', params.row.handleUser + params.row.handleUserName || '-');
        }
      }
    },
    {
      title: '类型',
      key: 'auditResult',
      align: 'center',
      render: (h, params) => {
        // let _this = this
        if (params.row.tag === 1) {
          return h('div', {
            style: {
              // height: '40px',
              // lineHeight: '40px',
              // cursor: 'pointer',
              color: '#fc9153'
            }
          }, params.row.auditResult || '-');
        } else {
          return h('div', params.row.auditResult || '-');
        }
      }
    },
    {
      title: '操作意见',
      key: 'actionMessage',
      align: 'center',
      render: (h, params) => {
        // let _this = this
        if (params.row.tag === 1) {
          return h('div', {
            style: {
              // height: '40px',
              // lineHeight: '40px',
              // cursor: 'pointer',
              color: '#fc9153'
            }
          }, params.row.actionMessage || '-');
        } else {
          return h('div', params.row.actionMessage || '-');
        }
      }
    }
  ];
  return onlineProcessColumns;
};
// 线下流程
export let offlineProcessColumns = _this => {
  let offlineProcessColumns = [
    {
      type: 'index',
      width: 80,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.offlineProcessColumns.receiptCode'
      ),
      key: 'receivedNumber',
      align: 'center'
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.offlineProcessColumns.receiptDate'
      ),
      key: 'receiveTime',
      align: 'center',
      render: (h, params) => {
        return h('div', params.row.receiveTime ? new Date(params.row.receiveTime).format('yyyy-MM-dd hh:mm:ss') : '-');
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.offlineProcessColumns.receiver'
      ),
      key: 'receiveUserName',
      align: 'center',
      render: (h, params) => {
        return h('div', params.row.receiveUserName ? params.row.receiveUserCode + params.row.receiveUserName : '-');
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.offlineProcessColumns.presenter'
      ),
      key: 'giveUserName',
      align: 'center',
      render: (h, params) => {
        return h('div', params.row.giveUserName ? params.row.giveUserCode + params.row.giveUserName : '-');
      }
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.offlineProcessColumns.printStatus'
      ),
      key: 'printStatus',
      align: 'center'
    },
    {
      title: _this.$i18n.t(
        'financeModule.expenseAccount.offlineProcessColumns.receiptTimes'
      ),
      key: 'receivedCount',
      align: 'center'
    }
  ];
  return offlineProcessColumns;
};
// 关联发票列表
export let relationInvoicesColumns = (_this) => {
  let relationInvoicesColumns = [
    {
      type: 'index',
      width: 50,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '票据种类',
      key: 'invoiceTypeName',
      align: 'center'
    },
    {
      title: '发票代码',
      key: 'invoiceCode',
      align: 'center'
    },
    {
      title: '发票号码',
      key: 'invoiceNumber',
      align: 'center'
    },
    {
      title: '金额(未税)',
      key: 'totalNetAmount',
      align: 'center'
    },
    {
      title: '税额',
      key: 'totalTaxAmount',
      align: 'center'
    },
    {
      title: '价税合计',
      key: 'totalAmount',
      align: 'center'
    },
    {
      title: '开票日期',
      key: 'billingDate',
      align: 'center',
      render: (h, params) => {
        let _billingDate = params.row.billingDate
          ? new Date(params.row.billingDate).format('yyyy-MM-dd')
          : '-';
        return h('div', _billingDate);
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (h, params) => {
        let { row } = params;
        return (
          <div>
            {
              _this.isRead ? (<span></span>) : (<a
              type="primary"
              style="margin-left:5px"
              on-click={() => _this.delRelationInvoice(row)}
            >
              删除
            </a>)
            }

          </div>
        );
      }
    }
  ];
  return relationInvoicesColumns;
};
// 共用影像列表
export let commonImgColumns = (_this) => {
  let commonImgColumns = [
    {
      type: 'index',
      width: 50,
      align: 'center',
      title: _this.$i18n.t('financeModule.collection.signColumns.index')
    },
    {
      title: '影像编号',
      key: 'randomCode',
      align: 'center'
    },
    {
      title: '本单据编号',
      key: 'receiptNo',
      align: 'center'
    },
    {
      title: '原单据编号',
      key: 'sourceReceiptNo',
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      render: (h, params) => {
        let { row } = params;
        return (
          <div>
            {
              _this.isRead ? (<span></span>) : (<a
              type="primary"
              style="margin-left:5px"
              on-click={() => _this.delRelationImg(row)}
            >
              删除
            </a>)
            }

          </div>
        );
      }
    }
  ];
  return commonImgColumns;
};
