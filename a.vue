<template>
  <div class="financeCountEnd-container">
    <div class="content-block" >
      <!-- <Breadcrumb>
        <BreadcrumbItem v-for="(item, index) in $route.meta.name" :key="index">{{item}}</BreadcrumbItem>
      </Breadcrumb> -->
      <Breadcrumb separator="/">
        <BreadcrumbItem>费用共享</BreadcrumbItem>
        <BreadcrumbItem>{{breadcrumb1}}</BreadcrumbItem>
        <BreadcrumbItem>{{breadcrumb2}}</BreadcrumbItem>
      </Breadcrumb>
    </div> 
    <div class="content_container">
      <Form class="formContainer" ref="" :label-width="80" style="margin-top: 0px">
        <Affix :offset-top="50">
         <div class="suspensionBtn">
          <Row> 
            <Col span="24">
              <!-- <FormItem label="" > -->
                <div v-if="formInfoFormRoute.fromPath==='myTasks'" style="display: inline-block"> 

                  <Button type="primary" v-if="basicMassege.currentNode!==2 && [2,4].indexOf(basicMassege.receiptStatus)!==-1 && !isRead"
                    class="btn_sty" @click="auditPass"><Icon type="ios-checkmark-circle" />{{ $t('financeModule.expenseAccount.auditPass') }}</Button>
                  <Button type="primary" v-html="$t('financeModule.expenseAccount.reject')" v-if="!isRead && basicMassege.currentNode!==2 &&[2,4].indexOf(basicMassege.receiptStatus)!==-1" @click="reject"></Button>
                  <!-- 因为之后安全管理还款和普通还款都合并单据类型为还款单，所以需要区分非安全类还款不能加签，暂存待办 -->
                  <Button type="primary" class="btn_sty" :loading="signLoading"
                    v-if="!isRead && basicMassege.currentNode!==2 && [2,4].indexOf(basicMassege.receiptStatus)!==-1 && basicMassege.isAddSign === 1"
                    :disabled="basicMassege.receiptStatus ===2 && basicMassege.receiptTypeName==='还款单'
                      && [ '一般借还款', '备用金', '平台罚款' ].includes(basicMassege.businessType)"
                    @click="additionalSignature" v-html="$t('financeModule.expenseAccount.additionalSignature')"></Button>
                  <a v-if="!isRead" @click="goDCpage()" class="goDchat">{{ $t('financeModule.expenseAccount.DChat') }} </a>
                </div>
                <div style="display: inline-block">
                  <Button type="primary"  class="btn_sty" v-if="formInfoFormRoute.fromPath!=='myTasks' && ['差旅申请单','申请单'].indexOf(basicMassege.receiptTypeName)===-1 && showImgBtn" @click="openImgWin">票据影像</Button>
                  <!-- <Button type="primary" v-if="basicMassege.currentNode!==2 && [2,4,5].indexOf(basicMassege.receiptStatus)!==-1 && ['差旅报销单','报销单'].indexOf(basicMassege.receiptTypeName)!==-1"
                    class="btn_sty" @click="showRelationModal">关联发票</Button> -->
                  <Button type="primary" v-if="basicMassege.currentNode!==2 && [2,4,5].indexOf(basicMassege.receiptStatus)!==-1 && ['差旅报销单','报销单'].indexOf(basicMassege.receiptTypeName)!==-1"
                    class="btn_sty" @click="showCommonImgModal">共用影像</Button>
                  <Button type="primary" 
                    v-if="(!isRead && ['差旅申请单','申请单'].indexOf(basicMassege.receiptTypeName)===-1 && !(basicMassege.receiptTypeName==='还款单' && [1,5].indexOf(basicMassege.receiptStatus)!==-1)) 
                    || basicMassege.currentNode===2 || (formInfoFormRoute.fromPath!=='myTasks' && ['差旅申请单','申请单'].indexOf(basicMassege.receiptTypeName)===-1) || (formInfoFormRoute.fromPath==='myTasks' && basicMassege.isHandle)"
                    :disabled="basicMassege.receiptStatus ===2 && basicMassege.receiptTypeName==='还款单'
                      && [ '一般借还款', '备用金', '平台罚款' ].includes(basicMassege.businessType)"
                    class="btn_sty" @click="goTemporaryStoragePage">{{ $t('financeModule.expenseAccount.temporaryStorage') }}</Button>
                  <!-- 因为之后安全管理还款和普通还款都合并单据类型为还款单，所以需要区分非安全类还款不能加签，暂存待办 -->
                  <Dropdown :transfer="true" @on-click="changeDropdownItem">
                    <Button type="primary" ghost >关联查询</Button>
                    <DropdownMenu slot="list">
                      <DropdownItem :name="0">上查</DropdownItem>
                      <DropdownItem :name="1">下查</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <!-- <Button class="btn_sty" @click="relationalQuery">{{ $t('financeModule.expenseAccount.relationalQuery') }}</Button> -->
                  <Button v-if="['差旅申请单','申请单'].indexOf(basicMassege.receiptTypeName)===-1" class="btn_sty" @click="printing" v-html="$t('financeModule.expenseAccount.printing')"></Button>
                  <!-- <Button class="btn_sty" @click="returnZ" v-html="$t('financeModule.expenseAccount.return')"></Button> -->
                  <!-- </FormItem>  -->
                </div>
              </Col>
          </Row>
         </div>
        </Affix>
        <!-- 基本信息模块 -->
        <div style="margin-top:2px">
          <Row>
            <Col :span="8">
              <h4>{{$t('financeModule.expenseAccount.receiptNo')}}：<span class="colorfc9153">{{formInfoFormRoute.docId}}</span></h4>
            </Col>
          </Row>
          <div style="padding: 20px 0 20px 0">
            <!-- 报销单 -->
            <Row v-if="['报销单','差旅报销单'].indexOf(basicMassege.receiptTypeName)!==-1">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.businessType')}}：</span><span class="colorfc9153">{{basicMassege.businessType|| '-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitter')}}：</span>{{basicMassege.submitPerson}}-{{basicMassege.submitPersonName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitTime')}}：</span>{{ basicMassege.submitTime?(new Date(basicMassege.submitTime).format('yyyy-MM-dd')):'-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.documentStatus')}}：</span><span class="colorfc9153">{{ basicMassege.receiptStatusName||'-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.currency')}}：</span>{{basicMassege.currency|| '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.totalReimbursementAmount')}}：</span>{{basicMassege.totalAmount.toFixed(2)}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.subordinateDepartments')}}：</span>{{(basicMassege.belongDepartment||'') + '-'+(basicMassege.belongDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.costDepartment')}}：</span>{{basicMassege.costDepartmentPath||''}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.companyMainBody')}}：</span>{{basicMassege.belongCompany || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.project')}}：</span>{{basicMassege.project}}-{{basicMassege.projectName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.contractNumber')}}：</span>{{basicMassege.contractNo || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.feeCycle')}}：</span>{{basicMassege.travelRange || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.sourceSystem')}}：</span>{{basicMassege.sourceName||'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.attachmentsNumber')}}：</span>{{basicMassege.attachmentNumber||0}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.actualReimburser')}}：</span>{{(basicMassege.realPerson||'') + '-' + (basicMassege.realPersonName||'')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentMethod')}}：</span>{{basicMassege.payWay || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentTerm')}}：</span>{{basicMassege.payCondition||'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：</span>{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.reimbursementType')}}：</span>{{ reimbursementTypeLabel(basicMassege.reimbursementType)}}</p>
              </Col>
              <Col span="8" v-if="isSmartInvoice">
                <p><span class="label">规则引擎：</span>{{ basicMassege.autoAuditDrools || '-'}}</p>
              </Col>
              <Col span="8" v-if="isSmartInvoice">
                <p><span class="label">智能审核结果：</span>{{ basicMassege.autoAuditResult || '-'}}</p>
              </Col>
            </Row>
            
            <!-- 差旅申请单 -->
            <Row v-if="['差旅申请单','申请单'].indexOf(basicMassege.receiptTypeName)!==-1">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.businessType')}}：</span><span class="colorfc9153">{{basicMassege.businessType|| '-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitter')}}：</span>{{basicMassege.submitPerson}}-{{basicMassege.submitPersonName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitTime')}}：</span>{{ basicMassege.submitTime?(new Date(basicMassege.submitTime).format('yyyy-MM-dd')):'-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.documentStatus')}}：</span><span class="colorfc9153">{{ basicMassege.receiptStatusName||'-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.currency')}}：</span>{{basicMassege.currency|| '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">金额：</span>{{ basicMassege.totalAmount?(Number(basicMassege.totalAmount)).toLocaleString('en-US', {minimumFractionDigits: 2}):'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">公司主体：</span>{{basicMassege.belongCompany|| '-'}}</p>
              </Col>
              <!-- 差旅周期 -->
              <Col span="24" v-if="basicMassege.receiptTypeName === '差旅申请单'">
                <p><span class="label">差旅周期：</span>{{ basicMassege.travelRange||'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.subordinateDepartments')}}：</span>{{(basicMassege.belongDepartment||'') + '-'+(basicMassege.belongDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.costDepartment')}}：</span>{{(basicMassege.costDepartment||'') + '-'+(basicMassege.costDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.project')}}：</span>{{basicMassege.project || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.sourceSystem')}}：</span>{{basicMassege.sourceName||'-'}}</p>
              </Col>
              <!-- <Col span="8">
                <p>{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col> -->
            </Row>
            <!-- 借款单 -->
            <Row v-if="basicMassege.receiptTypeName==='借款单'">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.businessType')}}：</span><span class="colorfc9153">{{basicMassege.businessType|| '-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitter')}}：</span>{{basicMassege.submitPerson}}-{{basicMassege.submitPersonName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitTime')}}：</span>{{ basicMassege.submitTime?(new Date(basicMassege.submitTime).format('yyyy-MM-dd')):'-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.documentStatus')}}：</span><span class="colorfc9153">{{ basicMassege.receiptStatusName||'-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.currency')}}：</span>{{basicMassege.currency|| '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.totalLoanAmount')}}：</span>{{ basicMassege.totalAmount?(Number(basicMassege.totalAmount)).toLocaleString('en-US', {minimumFractionDigits: 2}):'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.subordinateDepartments')}}：</span>{{(basicMassege.belongDepartment||'') +'-'+(basicMassege.belongDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.costDepartment')}}：</span>{{(basicMassege.costDepartment||'')+'-'+(basicMassege.costDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.companyMainBody')}}：</span>{{basicMassege.belongCompany || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.project')}}：</span>{{basicMassege.project || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.loanType')}}：</span>{{basicMassege.loanType || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.expectedRepaymentDate')}}：</span>{{basicMassege.expectedRepaymentDate?(new Date(basicMassege.expectedRepaymentDate).format('yyyy-MM-dd')):'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.sourceSystem')}}：</span>{{basicMassege.sourceName || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.balanceAmount')}}：</span>{{ basicMassege.balanceAmount?(Number(basicMassege.balanceAmount)).toLocaleString('en-US', {minimumFractionDigits: 2}):'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.actualLoanPerson')}}：</span>{{(basicMassege.realPerson||'') + '-' + (basicMassege.realPersonName||'')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentMethod')}}：</span>{{basicMassege.payWay || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentTerm')}}：</span>{{basicMassege.payCondition || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：</span>{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">是否虚拟：</span>{{basicMassege.isVirtual === 0 ? '否'
                    : basicMassege.isVirtual === 1 ? '是' : '-'}}</p>
              </Col>
              <Col span="8" v-if="isSmartInvoice">
                <p><span class="label">规则引擎：</span>{{ basicMassege.autoAuditDrools || '-'}}</p>
              </Col>
              <Col span="8" v-if="isSmartInvoice">
                <p><span class="label">智能审核结果：</span>{{ basicMassege.autoAuditResult || '-'}}</p>
              </Col>
              <!-- <Col span="8">
                <p>可用余额：{{basicMassege.payCondition.toFixed(2) || '-'}}</p>
              </Col> -->
            </Row>

            <!-- 还款单 -->
            <Row v-if="basicMassege.receiptTypeName==='还款单'">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.businessType')}}：</span><span class="colorfc9153">{{basicMassege.businessType|| '-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitter')}}：</span>{{basicMassege.submitPerson}}-{{basicMassege.submitPersonName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitTime')}}：</span>{{ basicMassege.submitTime?(new Date(basicMassege.submitTime).format('yyyy-MM-dd')):'-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.documentStatus')}}：</span><span class="colorfc9153">{{ basicMassege.receiptStatusName||'-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.currency')}}：</span>{{basicMassege.currency|| '-'}}</p>
              </Col>
              <Col span="8" >
                <p><span class="label">还款总金额：</span>{{ basicMassege.totalAmount?(Number(basicMassege.totalAmount)).toLocaleString('en-US', {minimumFractionDigits: 2}):'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.subordinateDepartments')}}：</span>{{(basicMassege.belongDepartment||'') + '-' +(basicMassege.belongDepartmentName||'')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.costDepartment')}}：</span>{{(basicMassege.costDepartment||'')+'-'+(basicMassege.costDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.companyMainBody')}}：</span>{{basicMassege.belongCompany || '-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.project')}}：</span>{{basicMassege.project || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.sourceSystem')}}：</span>{{basicMassege.sourceName || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：</span>{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col>
            </Row>
            <Row v-if="basicMassege.receiptTypeName==='还款单'">
              <Col span="8">
                <p><span class="label">是否虚拟：</span>{{basicMassege.isVirtual === 0 ? '否'
                    : basicMassege.isVirtual === 1 ? '是' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentMethod')}}：</span>{{basicMassege.payWay || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentTerm')}}：</span>{{basicMassege.payCondition || '-'}}</p>
              </Col>
            </Row>
            <Row v-if="basicMassege.receiptTypeName==='还款单'">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentReceiverCompany')}}：
                  </span>{{basicMassege.repaymentReceiverInfo ? basicMassege.repaymentReceiverInfo.accountName || '-' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentReceiverAcount')}}：
                  </span>{{basicMassege.repaymentReceiverInfo ? basicMassege.repaymentReceiverInfo.account || '-' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentReceiverBank')}}：
                  </span>{{basicMassege.repaymentReceiverInfo ? basicMassege.repaymentReceiverInfo.bank || '-' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentName')}}：
                  </span>{{ safeState ? basicMassege.submitPersonName || '-' :
                    basicMassege.repaymentInfo ? basicMassege.repaymentInfo.payerName || '-' : ''}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentAcount')}}：
                  </span>{{ safeState ? basicMassege.bankAccount || '-' :
                    basicMassege.repaymentInfo ? basicMassege.repaymentInfo.account || '-' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentBank')}}：
                  </span>{{ safeState ? basicMassege.bankName || '-' :
                    basicMassege.repaymentInfo ? basicMassege.repaymentInfo.bank || '-' : '-'}}</p>
              </Col>
              <!-- <Col span="8">
                <p><span class="label">{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：</span>{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col> -->
              <!-- <Col span="8">
                <p>是否虚拟：{{basicMassege.payCondition === 0 ? '是'
                    : basicMassege.payCondition === 1 ? '否' : '-'}}</p>
              </Col> -->
            </Row>
            <!-- 借款转移 -->
            <Row v-if="basicMassege.businessType==='借款转移' && basicMassege.receiptTypeName==='借款转移申请单'">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.businessType')}}：</span><span class="colorfc9153">{{basicMassege.businessType|| '-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitter')}}：</span>{{basicMassege.submitPerson}}-{{basicMassege.submitPersonName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitTime')}}：</span>{{ basicMassege.submitTime?(new Date(basicMassege.submitTime).format('yyyy-MM-dd')):'-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.documentStatus')}}：</span><span class="colorfc9153">{{ basicMassege.receiptStatusName||'-'}}</span></p>
              </Col>
               <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.currency')}}：</span>{{basicMassege.currency|| '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.subordinateDepartments')}}：</span>{{(basicMassege.belongDepartment||'') +'-'+(basicMassege.belongDepartmentName||'')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.sourceSystem')}}：</span>{{basicMassege.sourceName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.costDepartment')}}：</span>{{(basicMassege.costDepartment||'') + '-'+(basicMassege.costDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.loanReceiver')}}：</span>{{(basicMassege.realPerson||'') + '-' + (basicMassege.realPersonName||'')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：</span>{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col>
            </Row>
            <!-- 安全管理还款单 -->
            <Row v-if="basicMassege.receiptTypeName==='安全管理还款单'">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.businessType')}}：</span><span class="colorfc9153">{{basicMassege.businessType|| '-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitter')}}：</span>{{basicMassege.submitPerson}}-{{basicMassege.submitPersonName}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.submitTime')}}：</span>{{ basicMassege.submitTime?(new Date(basicMassege.submitTime).format('yyyy-MM-dd')):'-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.documentStatus')}}：</span><span class="colorfc9153">{{ basicMassege.receiptStatusName||'-'}}</span></p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.currency')}}：</span>{{basicMassege.currency|| '-'}}</p>
              </Col>
              <Col span="8" >
                <p><span class="label">还款总金额：</span>{{ basicMassege.totalAmount?(Number(basicMassege.totalAmount)).toLocaleString('en-US', {minimumFractionDigits: 2}):'-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.subordinateDepartments')}}：</span>{{(basicMassege.belongDepartment||'') + '-' +(basicMassege.belongDepartmentName||'')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.costDepartment')}}：</span>{{(basicMassege.costDepartment||'')+'-'+(basicMassege.costDepartmentName || '')}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.companyMainBody')}}：</span>{{basicMassege.belongCompany || '-' }}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.project')}}：</span>{{basicMassege.project || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.sourceSystem')}}：</span>{{basicMassege.sourceName || '-'}}</p>
              </Col>
              <!-- <Col span="8">
                <p>{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col> -->
            </Row>
            <Row v-if="basicMassege.receiptTypeName==='安全管理还款单'">
              <Col span="8">
                <p><span class="label">是否虚拟：</span>{{basicMassege.isVirtual === 0 ? '否'
                    : basicMassege.isVirtual === 1 ? '是' : '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentMethod')}}：</span>{{basicMassege.payWay || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.paymentTerm')}}：</span>{{basicMassege.payCondition || '-'}}</p>
              </Col>
            </Row>
            <Row v-if="basicMassege.receiptTypeName==='安全管理还款单'">
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentName')}}：</span>{{basicMassege.submitPersonName || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentAcount')}}：</span>{{basicMassege.bankAccount || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.expenseAccount.repaymentBank')}}：</span>{{basicMassege.bankName || '-'}}</p>
              </Col>
              <Col span="8">
                <p><span class="label">{{$t('financeModule.repaymentForm.repaymentTableColumns.bookkeepingStatus')}}：</span>{{basicMassege.pushVoucherStatus === 0 ? '未记账'
                    : basicMassege.pushVoucherStatus === 1 ? '已记账' : '-'}}</p>
              </Col>
              <!-- <Col span="8">
                <p>是否虚拟：{{basicMassege.payCondition === 0 ? '是'
                    : basicMassege.payCondition === 1 ? '否' : '-'}}</p>
              </Col> -->
            </Row>

            <!-- 附件模块 -->
            <Row>
              <Col v-if="basicMassege.receiptTypeName==='还款单'" span="24">
                <!-- 还款单增加附件上传按钮 -->
                <Button @click="uploadElectronicInvoice()" style="margin-left: 20px"
                  v-if="formInfoFormRoute.fromPath==='myTasks' && [2,4].indexOf(basicMassege.receiptStatus)!==-1"
                >点击上传</Button>
                <span class="label">附件：</span>
                <!-- 上游传来的附件 无法删除 -->
                <a @click="openFile(downLink)" v-if="basicMassege.repaymentInfo && basicMassege.repaymentInfo.downLink && basicMassege.repaymentInfo.downLink.length"
                  v-for="(downLink,index) in basicMassege.repaymentInfo? basicMassege.repaymentInfo.downLink : []" :key="index">
                  {{'附件'+(index+1)}}<span v-if="basicMassege.repaymentInfo && index!==basicMassege.repaymentInfo.downLink.length-1">,</span>
                </a>
                <!-- 财务上传的附件  可以进行操作 -->
                <span v-if="basicMassege.attachmentList && basicMassege.attachmentList.length>0">
                  <Tag v-for="(attachment, _fileIndex) in basicMassege.attachmentList" :closable="!isRead"
                      :key="_fileIndex"  @on-close="delFile('attachmentList',_fileIndex)" type="border" >
                    <a @click="downloadFile(attachment)">
                      {{ attachment.attachmentName }}
                    </a>
                  </Tag>
                </span>
              </Col>
              <!-- 单据附件 -->
              <Col :span="24" v-if="basicMassege.receiptTypeName!=='还款单'"> 
                <Button @click="uploadElectronicInvoice()" style="margin-left: 20px"
                  v-if="formInfoFormRoute.fromPath==='myTasks' && [2,4].indexOf(basicMassege.receiptStatus)!==-1"
                >点击上传</Button>
                <!-- 上游传来的附件 无法删除 -->
                <span class="label" style="width: 50px">附件：</span>
                <a @click="openFile(downLink)" v-if="basicMassege.downLink && basicMassege.downLink.length" v-for="(downLink,index) in basicMassege.downLink" :key="index">
                  {{'附件'+(index+1)}}<span v-if="index!==basicMassege.downLink.length-1">,</span>
                </a>
                <!-- 财务上传的附件  可以进行操作 -->
                <span v-if="basicMassege.attachmentList && basicMassege.attachmentList.length>0">
                  <Tag v-for="(attachment, _fileIndex) in basicMassege.attachmentList" :key="_fileIndex"
                    :closable="!isRead"  @on-close="delFile('attachmentList',_fileIndex)" type="border" >
                    <a @click="downloadFile(attachment)">
                      {{ attachment.attachmentName }}
                    </a>
                  </Tag>
                </span>
              </Col>
              <!-- 本次上线取消对私上传电子发票功能 -->
              <!-- <Col :span="24" v-if="formInfoFormRoute.fromPath==='myTasks' && (basicMassege.receiptTypeName!=='报销单' || basicMassege.receiptTypeName!=='差旅报销单')"> 
                <Button @click="uploadElectronicInvoice()">点击上传</Button>
              </Col> -->
            </Row>
            <Row style="margin: 10px 0" >
              <Col span="2" class="label" v-if="['借款单','差旅申请单','申请单','借款转移申请单','安全管理还款单'].indexOf(basicMassege.receiptTypeName)===-1">备注：</Col>
              <Col span="2" class="label" v-if="['借款单','差旅申请单','申请单'].indexOf(basicMassege.receiptTypeName)!==-1">事由：</Col>
              <Col span="20">
                <Input type="textarea" v-if="['借款单','差旅申请单','申请单','借款转移申请单','安全管理还款单'].indexOf(basicMassege.receiptTypeName)===-1 && basicMassege.receiptTypeName!=='还款单'" readonly v-model="basicMassege.remark" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注" />
                <Input type="textarea" v-if="['借款单','差旅申请单','申请单','借款转移申请单','安全管理还款单'].indexOf(basicMassege.receiptTypeName)===-1 && basicMassege.receiptTypeName==='还款单'" readonly :value="basicMassege.repaymentInfo ? basicMassege.repaymentInfo.remark : ''" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注" />
                <Input type="textarea" v-if="['借款单','差旅申请单','申请单'].indexOf(basicMassege.receiptTypeName)!==-1" readonly v-model="basicMassege.cause" :autosize="{minRows: 2,maxRows: 5}" placeholder="事由" />
              </Col>
            </Row>
            
            <Row>
              <Col span="24"><span class="label">说明：</span>{{basicMassege.description}}</Col>
              <!-- <Col span="20">
                <Input type="textarea" readonly v-model="basicMassege.description" :autosize="{minRows: 2,maxRows: 5}" placeholder="说明" />
              </Col> -->
            </Row>
          </div>
        </div>
        
        <div class="showLine"></div>
        <!-- 差旅行程 -->
        <Row v-if="basicMassege.travelItinerarys">
          <Col :span="8">
            <h4>差旅行程</h4>
          </Col>
        </Row>
        <!-- 表格 -->
        <div v-if="basicMassege.travelItinerarys" style="width: 100%;overflow: auto;margin: 10px 0 10px 0">
          <Table border stripe size="small" :columns="travelItinerarysColumns" :data="basicMassege.travelItinerarys || []"></Table>
        </div>
        <div v-if="basicMassege.travelItinerarys" class="showLine"></div>

        <!-- 费用明细模块 -->
        <div v-if="this.expensesDetailsTableDataReal && this.expensesDetailsTableDataReal.length"> 
          <Row>
            <Col :span="16">
              <h4>费用明细</h4>
            </Col>
            <Col :span="8" style="text-align:right">
              <Checkbox v-model="showNoInvoice">查看无票费用</Checkbox>
            </Col>
          </Row>
          <!-- 表格 -->
          <div style="width: 100%;overflow: auto;">
            <Table :height="(expensesDetailsTableData.length>10)?460:'auto'" border stripe size="small" :columns="expensesDetailsColumns" :data="expensesDetailsTableData" style="margin: 10px 0 10px 0;max-height:460px;overflow:auto" ></Table>
          </div>
          <Row>
            <Col :span="24">
              贴票金额 {{basicMassege.currency +' '+ Number(basicMassege.patchAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}}
              ，无需贴票金额 {{ basicMassege.currency +' ' + Number(basicMassege.noPatchAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}}
              ，#C税额 {{ basicMassege.currency +' ' + lineCtypeTotalAmount }}
            </Col>
          </Row>
          <div class="showLine"></div>
        </div>
        <!-- 关联差旅申请模块 -->
        <div v-if="relatedTravelApplicationDate && relatedTravelApplicationDate.length"> 
          <Row>
            <Col :span="8">
              <h4>关联差旅申请</h4>
            </Col>
          </Row>
            <!-- 表格 -->
            <div style="width: 100%;overflow: auto">
              <Table border stripe size="small" :columns="relatedTravelApplicationColumns" :data="relatedTravelApplicationDate" style="margin: 10px 0 10px 0" ></Table>
            </div>
            <div class="showLine"></div>

        </div>
        <!-- 关联申请单 - 业务招待类型 -->
        <div v-if="relatedTravelRequisitionData && relatedTravelRequisitionData.length"> 
          <Row>
            <Col :span="8">
              <h4>关联申请</h4>
            </Col>
          </Row>
            <!-- 表格 -->
            <div style="width: 100%;overflow: auto">
              <Table border stripe size="small" :columns="relatedTravelRequisitionColumns" :data="relatedTravelRequisitionData" style="margin: 10px 0 10px 0" ></Table>
            </div>
            <div class="showLine"></div>
        </div>
        <!-- 还款单行信息 -->
        <div v-if=" ['还款单'].includes(basicMassege.receiptTypeName)"> 
          <Row>
            <Col :span="16">
              <h4>行信息</h4>
            </Col>
          </Row>
          <!-- 表格 -->
          <div style="width: 100%;overflow: auto;">
             <Table class="mt10" :height="(lineListData.length>10)?460:'auto'" :data="lineListData" border
               :columns="lineColumns" style="max-height:460px; overflow:auto"></Table>
          </div>
          <div class="showLine"></div>
        </div>
        <!-- 冲借款模块 -->
        <div v-if=" ['还款单','报销单','差旅报销单'].indexOf(basicMassege.receiptTypeName)!==-1 && basicMassege.writeOffLoan && basicMassege.writeOffLoan.length">
          <Row>
            <Col :span="8">
              <h4>冲借款</h4>
            </Col>
          </Row>
          <!-- 表格 -->
          <div style="width: 100%;overflow: auto">
            <Table :width="basicMassege.writeOffLoan && basicMassege.writeOffLoan.length?'auto':681" border stripe size="small" :columns="writeOffLoanColumns" :data="basicMassege.writeOffLoan" style="margin: 10px 0 10px 0" ></Table>
          </div>
          <div class="showLine"></div>
        </div>

        <div v-if=" ['安全管理还款单'].indexOf(basicMassege.receiptTypeName)!==-1 && basicMassege.applicationRepaymentRecord && basicMassege.applicationRepaymentRecord.length">
          <Row>
            <Col :span="8">
              <h4>冲借款</h4>
            </Col>
          </Row>
          <!-- 表格 -->
          <div style="width: 100%;overflow: auto">
            <Table :width="basicMassege.applicationRepaymentRecord && basicMassege.applicationRepaymentRecord.length?'auto':681" border stripe size="small" :columns="writeOffLoanColumns2" :data="basicMassege.applicationRepaymentRecord" style="margin: 10px 0 10px 0" ></Table>
          </div>
          <div class="showLine"></div>
        </div>
          
        <div v-if="this.rushLoanTableData && this.rushLoanTableData.length">
          <div style="width: 100%;overflow: auto">
            <!-- 借款列表展示 -->
            <Table :width="rushLoanTableData.length?'auto':681" border stripe size="small" :columns="rushLoanColumns" :data="rushLoanTableData" style="margin: 10px 0 10px 0" ></Table>
          </div>
          <div class="showLine"></div>
        </div>
          <!-- 被转移借款单模块 -->
        <div v-if="this.TransferredLoanSlipDate && this.TransferredLoanSlipDate.length">
          <Row>
            <Col :span="8">
              <h4>被转移借款单</h4>
            </Col>
          </Row>
            <!-- 表格 -->
            <div style="width: 100%;overflow: auto">
              <Table :width="TransferredLoanSlipDate.length?'auto':681" border stripe size="small" :columns="TransferredLoanSlipColumns" :data="TransferredLoanSlipDate" style="margin: 10px 0 10px 0" ></Table>
            </div>
            <div class="showLine"></div>

        </div>
          <!-- 发票信息模块 -->
        <div v-if="['报销单','差旅报销单'].indexOf(basicMassege.receiptTypeName)!==-1">
          <Row>
            <Col :span="8">
              <h4>发票信息</h4>
            </Col>
          </Row>
          <Row v-if="!checkSpecType">
            <Col span="5">
              <FormItem :label="$t('financeModule.base.invoiceStatus')">
                <Select v-model="formValidate.checkStatus" clearable>
                  <Option v-for="(item, _index) in checkStatuses" :value="item.code" :key="_index" >{{item.zValue}}</Option>
                  <!-- <Option v-for="item in invoiceTypeSel" :value="item.value" :key="item.id" :label="item.label">{{item.zValue}}</Option> -->
                </Select>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="影像编号" >
                <Input type="text" v-model="formValidate.imgRandomCode"/>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="" >
                <Checkbox v-model="formValidate.onlyDuplicate">{{$t('financeModule.expenseAccount.onlyViewRepeat')}}</Checkbox>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="" >
                <Checkbox v-model="formValidate.onlyElectronic">{{$t('financeModule.expenseAccount.onlyElectronic')}}</Checkbox>
              </FormItem>
            </Col>
            <Col span="4" style="text-align: right">
              <Button type="primary" class="btn_sty" @click="getInvoiceInformationDate()">{{ $t('common.query',[ $t('common.all')]) }}</Button>
              <Button class="btn_sty" @click="clearSearchForm">重置</Button>
            </Col>
          </Row>
          <Row class="form-sub-title">
            <Col span="4">
              <!-- <FormItem label="" v-if="!isRead"> -->
                <Button class="btn_sty" v-if="!isRead" type="primary" @click="checkInvoice('more')">{{ $t('financeModule.expenseAccount.inspection') }}</Button>
              <!-- </FormItem> -->
            </Col>
            <Col :span="isRead?24:20" style="text-align: right">
              <Button class="btn_sty" v-if="!isRead && basicMassege.flowNodeType === 'firstAudit' && showTransAmountButtonFlag " type="primary" :loading="transLoading" @click="realTrans()">转出填充</Button>
              <Radio-group v-model="checkSpec" type="button" @on-change="changeInvoiceInformationDate">
                <Radio v-for="(item, _index) in invoiceType" :label="item.code" :key="_index">
                  {{item.zValue}} {{ columnsNumber[item.listName] }}
                </Radio>
              </Radio-group>
            </Col>
          </Row>
          <!-- <Table class="mt10" style="margin: 10px 0 10px 0"  border :columns="invoiceColumns" :data="invoiceInformationDate" @on-selection-change="changeSelect"></Table> -->
          <Table class="mt10" :height="(invoiceInformationDate.length>10)?460:'auto'" v-if="checkSpec=='普票'" border :columns="invoiceColumnsP" :data="invoiceInformationDate" @on-selection-change="changeSelect" style="max-height:460px; overflow:auto"></Table>
          <Table class="mt10" :height="(invoiceInformationDate.length>10)?460:'auto'" v-if="checkSpec=='专票'" border :columns="invoiceColumnsZ" :data="invoiceInformationDate" @on-selection-change="changeSelect" style="max-height:460px; overflow:auto"></Table>
          <Row v-if="!isRead && !checkSpecType" style="margin: 0 0 10px 0" >
            <Col span="24">
              <Button class="btn_sty" :loading="addnewLoading" type="dashed" long @click="addNewrow"> + 新增发票信息</Button>
            </Col>
          </Row>
          <Row v-if="!checkSpecType">
            <Col span="12">
              <span>发票价税合计金额</span> <span style="color: #fc9153">{{relatedTableTaxSumD}} </span>
            </Col>
          </Row>

          <!-- 智能审核单据列表开始 -->
          <div v-for="tableInvoice in smartInvoiceType">
            <Table class="mt10" :height="(tableInvoice.list.length>10)?460:'auto'" :data="tableInvoice.list" border
              v-show="checkSpec==tableInvoice.code" :columns="tableInvoice.columns" style="max-height:460px; overflow:auto"></Table>
            <Row v-show="!isRead && checkSpecType && checkSpec==tableInvoice.code" style="margin: 0 0 10px 0" >
              <Col span="24">
                <Button class="btn_sty" type="dashed" long @click="addSmartRow(tableInvoice)"> + 新增票据信息</Button>
              </Col>
            </Row>
            <Row v-if="checkSpecType && checkSpec==tableInvoice.code">
              <Col span="12">
                <span>票据合计金额</span> <span style="color: #fc9153"> {{ smartTotalAmount }} </span>
              </Col>
            </Row>
          </div>
          <!-- 智能审核单据列表结束 -->

          <div class="showLine"></div>

        </div>
        <!-- 业务招待类型 -->
        <div v-if="['申请单'].indexOf(basicMassege.receiptTypeName)!==-1">
          <div>
            <h4>业务招待类型</h4>
          </div>
          <div style="width: 100%;overflow: auto;margin: 10px 0 10px 0">
            <!-- 业务招待表格 -->
            <Table border stripe size="small" :columns="requisitionColumns" :data="requisitionDatas.detailList || []"></Table>
          </div>
        </div>
        
      <!-- 规则列表模块 -->
      <!-- <Row>
          <Col :span="8">
            <h4>规则</h4>
          </Col>
        </Row> -->
        <Row class="form-sub-title">
        <Col :span="24" style="text-align: right">
          <Radio-group v-model="rule" type="button" @on-change="changeRule">
            <Radio :label="4" v-if="isSmartInvoice">令才规则执行结果</Radio>
            <Radio :label="1">{{ isSmartInvoice ? 'FSSC' : '' }}规则执行结果</Radio>
            <Radio :label="2">线上流转</Radio>
            <Radio :label="3">线下流转</Radio>
          </Radio-group>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
          <!-- 智能审核 执行规则展示条件  我的待办进入 且 初审复审 -->
          <Button type="primary" class="btn_sty" @click="doRule" :loading="smartDataLoading" v-if="rule === 1 ||
            (rule === 4 && [4].includes(basicMassege.currentNode) && formInfoFormRoute.fromPath === 'myTasks')">执行规则</Button>
          <Checkbox v-if="isSmartInvoice && rule === 4" v-model="smartCorrect" true-value="未通过" false-value="通过"
            style="margin-left: 10px;">仅查看未通过结果</Checkbox>
        </Col>
        <Col :span="12">
          <p v-if="isSmartInvoice && rule === 4" style="text-align: right;">
            <span class="label">智能审核结果：</span>{{ basicMassege.autoAuditResult || '-'}}
          </p>
        </Col>
      </Row>
      <Table class="mt10" v-if="rule=='1'" border :columns="ruleExecutionResultColumns" :data="ruleTableData" style="margin: 10px 0 10px 0" ></Table>
      <Table class="mt10" v-if="rule=='2'" border :columns="onlineProcessColumns" :data="taskSharingOlineDate" style="margin: 10px 0 10px 0" ></Table>
      <Table class="mt10" v-if="rule=='3'" border :columns="offlineProcessColumns" :data="taskSharingOfflineDate" style="margin: 10px 0 10px 0" ></Table>
      <!-- 智能审核线上流转 -->
      <Table class="mt10" v-if="rule=='4'" border :columns="smartProcessColumns" :loading="smartDataLoading" :data="smartFilterData" style="margin: 10px 0 10px 0" ></Table>
       <Row v-if="basicMassege.referralType">
          <Col :span="24">
            <span>纸质流转方式填写：</span>
            <a @click="toPaperFill()">{{locationHost}}</a>
          </Col>
        </Row>
      </Form>
    </div>
    <!-- 审核通过弹窗 -->
    <Drawer title="审核通过" :mask-closable="false" v-model="auditPassDrawer" width="40%">
      <div>
        <Form :label-width="100" >
          <Row>
            <FormItem :label="$t('financeModule.expenseAccount.receiptNo') + '：'">
              <p>{{basicMassege.receiptNo}}</p>
            </FormItem>
          </Row>
          <Row>
            <FormItem :label="$t('financeModule.expenseAccount.submitter') + '：'">
              <p>
                {{basicMassege.submitPersonName +'-'+ basicMassege.submitPerson}}
              </p>
            </FormItem>
          </Row>
          <Row v-if="basicMassege.scanUploadEmpCode">
            <FormItem :label="$t('financeModule.expenseAccount.chargePerson') + '：'">
              <p>
                {{basicMassege.scanUploadEmpName +'-'+ basicMassege.scanUploadEmpCode}}
              </p>
            </FormItem>
          </Row>
          <Row>
            <FormItem :label="$t('financeModule.expenseAccount.processingMode') + '：'">
              <p>
                审核通过
              </p>
            </FormItem>
          </Row>
          <!-- 单据类型为还款单不需要填写收款时间，收款账号，交易流水号，改为行信息填写 -->
          <Row v-if="basicMassege.flowNodeType ==='cash' && basicMassege.receiptTypeName !== '还款单'">
            <FormItem label="收款时间：">
              <p>
                <DatePicker v-model="repayDate" :options="endTimeOptions" type="date" format="yyyy-MM-dd" placeholder="请选择"></DatePicker>
              </p>
            </FormItem>
          </Row>
          <Row v-if="basicMassege.flowNodeType ==='cash' && basicMassege.receiptTypeName !== '还款单'">
            <Col span="22">
              <FormItem label="收款实际账号：">
                <p>
                  <Input :maxlength="30" v-model="repaymentAccount" @on-keyup="repaymentAccount = repaymentAccount.replace(/[^0-9]/ig, '')" placeholder="收款实际账号"/>
                </p>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="basicMassege.flowNodeType ==='cash' && basicMassege.receiptTypeName !== '还款单'">
            <Col span="22">
              <FormItem label="交易流水号：">
                <p>
                  <Input type="textarea" max-length="200" v-model="serialNo" :autosize="{minRows: 2,maxRows: 5}" placeholder="交易流水号" />
                </p>
              </FormItem>
            </Col>
          </Row>
          <Row style="margin-bottom: 10px">
            <Col span="22">
              <FormItem :label="$t('financeModule.expenseAccount.handlingOpinions') + '：'">
                <Input type="textarea" max-length="200" v-model="auditPassDrawerNote" :autosize="{minRows: 2,maxRows: 5}" placeholder="处理意见" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="drawer-footer">
        <Button type="primary" :loading="auditPassLoading" @click="auditPassDrawerOkBox">{{$t('common.confirm')}}</Button>
        <Button @click="cancelAuditPass">{{$t('common.cancel')}}</Button>
      </div>
    </Drawer>
    <!-- 审核退回弹窗 -->
    <Drawer title="审核退回" :mask-closable="false" v-model="rejectDrawer" width="40%">
      <div>
        <Form :label-width="100" >
          <Row>
            <Col span="8">
              <p>退回节点： </p>
            </Col>
          </Row>
          <Row :gutter="16" v-if="basicMassege.sendBackNodes && basicMassege.sendBackNodes.includes('user')">
            <Col span="12" >
              <FormItem>
                <RadioGroup v-model="rejectDate.rejectPeople" @on-change="changeRejectPeople(1)">
                  <Radio label="0">
                    <span>提交人</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="处理结果" >
                <Select v-model="rejectDate.sendBackResult" :disabled="rejectDate.rejectPeople!=='0'">
                  <Option v-for="(item, _index) in processing1" :value="item.code" :key="_index">{{item.zValue}}</Option>
                </Select>
              </FormItem>
              </Col>
          </Row>
          <!-- <Row v-if="basicMassege.sendBackNodes && basicMassege.sendBackNodes.includes('scan')"> -->
          <Row >
            <Col span="12">
              <FormItem>
                <RadioGroup v-model="rejectDate.rejectPeople" @on-change="changeRejectPeople(2)">
                  <Radio label="1">
                    <span>扫描组</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="处理结果" >
                <Select v-model="rejectDate.sendBackResult" :disabled="rejectDate.rejectPeople!=='1'">
                  <Option v-for="(item, _index) in processing2" :value="item.code" :key="_index">{{item.zValue}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="basicMassege.sendBackNodes && basicMassege.sendBackNodes.includes('firstAudit')">
            <Col span="12">
              <FormItem>
                <RadioGroup v-model="rejectDate.rejectPeople" @on-change="changeRejectPeople(2)">
                  <Radio label="2">
                    <span>初审组</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="处理结果" >
                <Select v-model="rejectDate.sendBackResult" :disabled="rejectDate.rejectPeople!=='2'">
                  <Option v-for="(item, _index) in processing3" :value="item.code" :key="_index">{{item.zValue}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="basicMassege.sendBackNodes && basicMassege.sendBackNodes.includes('cash') && 
            basicMassege.receiptType === '还款单'">
            <Col span="12">
              <FormItem>
                <RadioGroup v-model="rejectDate.rejectPeople" @on-change="changeRejectPeople(2)">
                  <Radio label="3">
                    <span>资金组</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="处理结果" >
                <Select v-model="rejectDate.sendBackResult" :disabled="rejectDate.rejectPeople!=='3'">
                  <Option v-for="(item, _index) in processing3" :value="item.code" :key="_index">{{item.zValue}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="isSupplement">
            <Col span="12">
              <FormItem>
                <RadioGroup v-model="rejectDate.rejectPeople" @on-change="changeRejectPeople(2)">
                  <Radio label="4">
                    <span>人工补录</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="处理结果" >
                <Select v-model="rejectDate.sendBackResult" :disabled="rejectDate.rejectPeople!=='4'">
                  <Option v-for="(item, _index) in processing4" :value="item.code" :key="_index">{{item.zValue}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="['0','1','2','3', '4'].indexOf(rejectDate.rejectPeople) !==-1">
            <Col span="16">
              <FormItem label="退回原因" >
                <Input v-model="rejectDate.reason" type="textarea"  :maxlength="255" :rows="4" placeholder="退回原因" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem>
              <Checkbox v-model="rejectDate.intelligentReturn" :disabled="empStatus === 1">智能退回</Checkbox>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div class="drawer-footer">
        <Button type="primary" :loading="rejectLoading" @click="beforeReject">{{$t('common.confirm')}}</Button>
        <Button @click="cancelReject">{{$t('common.cancel')}}</Button>
      </div>
    </Drawer>
    <!-- 审核加签弹窗 -->
    <Drawer title="加签" :mask-closable="false" v-model="additionalSignatureDrawer" width="40%">
      <div>
        <Form :label-width="100" >
          <Row>
            <Col span="16">
              <FormItem label="被加签人：">
                  <Select v-model="additionalSignatureData.handoverPerson" clearable placeholder="被加签人"
                    :loading="loading1" filterable remote :remote-method="queryByName" :label-in-value="true" @on-change="changeHandoverPerson">
                    <Option v-for="(option, index) in addSignOptions" :label="option.empName+'-'+option.empCode" :key="index" :value="option.empCode">
                      <span >{{option.empName}}（{{option.empCode}}）</span>
                    </Option>
                  </Select>
                </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="16">
              <FormItem>
                <Tag v-for="(item , _index) in additionalSignatureData.handoverPersons" :key="_index" type="border" :closable="true" @on-close="delSign(_index)">{{ item.label }}</Tag>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="16">
              <FormItem label="加签备注：">
                <Input type="textarea" :maxlength="200" v-model="additionalSignatureData.note" :autosize="{minRows: 2,maxRows: 5}" placeholder="加签备注" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="16">
              <FormItem>
                <Checkbox v-model="additionalSignatureData.addApproverBack">被加签人批复后需将节点指回我</Checkbox>
              </FormItem>
            </Col>
          </Row>
          
        </Form>
      </div>
      <div class="drawer-footer">
        <Button type="primary" :loading="signLoading" @click="additionalSignatureOk">{{$t('common.confirm')}}</Button>
        <Button @click="cancelAdditionalSignature">{{$t('common.cancel')}}</Button>
      </div>

      <Modal v-model="editReferralModel" title="纸质领取方式" 
        width=800 @on-cancel="closeEditReferralModel">
        <div>
          <Form label-position='left' :label-width="80">
            <Row :gutter="16">
              <Col span="6">
                <FormItem :label-width="0">
                  单据及纸质转交附件处理方式:
                </FormItem>
              </Col>
              <Col span="16">
                <FormItem :label-width="0">
                  <RadioGroup v-model="referralNotice.referralType" :value="referralNotice.referralType">
                    <Radio :label='_radio' v-for="(_radio,_index) in referraltypeList" v-if="['暂存封存','归档'].indexOf(_radio)===-1" :key="_index">
                      <span>{{_radio}}</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16" v-if="referralNotice.referralType==='快递寄回'">
              <Col span="8">
                <FormItem label="收货人:">
                  <Input type="text" :placeholder="$t('common.input')" v-model.trim="referralNotice.receiveName"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="收货人电话:">
                  <Input type="text" :placeholder="$t('common.input')" v-model.trim="referralNotice.receiveMobile"/>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16" v-if="referralNotice.referralType==='快递寄回'">
              <Col span="16">
                <FormItem label="收货地址:">
                  <Input type="text" :placeholder="$t('common.input')" v-model.trim="referralNotice.receiveAddress"/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="paperLoading" @click="saveReferral">{{$t('common.confirm')}}</Button>
          <Button type="primary" @click="closeEditReferralModel">{{$t('common.cancel')}}</Button>
        </div>
      </Modal>
    </Drawer>

    <!-- 影像弹窗 -->
    <Modal
      v-model="imgsModal"
      width="1000px"
      title="附件"
      @on-cancel="closeImgModal">
      <Row>
        <Col style="overflow: scroll;max-height: 450px" >
          <div v-for="(img ,_index1) in feeImgs" :key="_index1"
            class="img_container">
            <div style="font-size: 16px;text-align: center;color: #464C5B;margin: 16px 0 8px 0;"
              v-if="feeImgs && feeImgs.length!==1" > 图片：{{_index1+1}} </div>
              <Row type="flex" justify="end" style="position: absolute;top:10px;right:20px;z-index:2" >
                  <Button class="btn_img"  @click="handleActions('clocelise', img)">
                    <Icon type="md-refresh" style="font-size: 15px;vertical-align: middle;"></Icon> 旋转</Button>
                  <Button class="btn_img" @click="handleActions('zoomIn', img)">
                    <Icon type="md-resize" style="font-size: 15px;vertical-align: middle;"></Icon> 放大</Button>
                  <Button class="btn_img" @click="handleActions('zoomOut', img)">
                    <img width="12px" alt="缩小" src="../../../../assets/suoxiao@1x.svg"> 缩小</Button>
              </Row>
            <div style="text-align: center;overflow: hidden;" :style="{ height: `${img.height}px` }">
              <iframe  v-if="img.type === 'pdf'" id="iframeContent" :src="img.src + '#toolbar=0'"
                  :style="{ transform: `scale(${img.transform.scale}) rotate(${img.transform.rotation}deg)`,
                    transition: (img.transform.enableTransition ? 'transform .3s' : ''),
                    'margin-left': `${img.transform.offsetX}px`,
                    'margin-top': `${img.transform.offsetY}px`
                    }" title="发票"
                  width="100%" height='560px'></iframe>
              <img :src="img.src"
                  v-else
                  :style="{ transform: `scale(${img.transform.scale}) rotate(${img.transform.rotation}deg)`,
                    transition: (img.transform.enableTransition ? 'transform .3s' : ''),
                    'margin-left': `${img.transform.offsetX}px`,
                    'margin-top': `${img.transform.offsetY}px`
                    }"
                    alt="发票"
                    @load="handleImgLoad($event, img)"
                    @error="handleImgError($event, img)"
                    @mousedown="handleMouseDown($event, img)"
                >
            </div>
          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="closeImgModal">关闭</Button>
      </div>
    </Modal>
    <!-- 关联发票弹窗 -->
    <Drawer title="关联发票" :mask-closable="false" v-model="relationModal" width="60%">
      <div>
        <Form :label-width="100" >
          <Row>
            <Col span="8" v-if="!isRead">
              <FormItem label="发票代码:">
                <Input v-model="relationInvoiceForm.invoiceCode" type="text" placeholder="发票代码" />
              </FormItem>
            </Col>
            <Col span="8" v-if="!isRead">
              <FormItem label="发票号码:">
                <Input v-model="relationInvoiceForm.invoiceNumber" type="text" placeholder="发票号码" />
              </FormItem>
            </Col>
            <Col span="8" style="text-align:center">
              <Button type="text" class="tcolor-orange" @click="queryRelationInvoice">查看已关联发票</Button>
            </Col>
          </Row>
          <Row v-if="!isRead">
            <Col style="text-align:center">
              <Button type="primary" :loading="relationInvoiceLoading" @click="realRelationInvoice">{{$t('common.confirm')}}</Button>
              <Button @click="closeRelationModal">{{$t('common.cancel')}}</Button>
            </Col>
          </Row>
        </Form>
        <Table v-if="showRelationInvoiceTable" class="mt10" border :columns="relationInvoicesColumns" :data="relationInvoices" style="margin: 10px 0 10px 0" ></Table>
      </div>
    </Drawer>
    <!-- 共用影像弹窗 -->
    <Drawer title="共用影像" :mask-closable="false" v-model="commonImgModal" width="60%">
      <div>
        <Form :label-width="100" v-if="!isRead">
          <Row>
            <Col span="8">
              <FormItem label="影像编号:">
                <Input v-model="commonImgForm.randomCode" type="text" placeholder="影像编号" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col style="text-align:center">
              <Button type="primary" :loading="commonImgLoading" @click="conformRelationImg">{{$t('common.confirm')}}</Button>
              <Button @click="closeCommonImgModal">{{$t('common.cancel')}}</Button>
            </Col>
          </Row>
        </Form>
        <Table class="mt10" border :columns="commonImgColumns" :data="commonImgs" style="margin: 10px 0 10px 0" ></Table>
      </div>
    </Drawer>

    <!-- 新增行登记弹窗 -->
    <Modal v-model="lineCheckModal" width="60%" :transfer="false" :z-index="999" title="行登记"
      :mask-closable="false" @on-cancel="closeLineCheckModal">
        <!-- 费用行信息展示 -->
        <Row class="expenses" type="flex" justify="start">
            <Col span="6">行序号： {{ headerLineInfo._index + 1 || '' }}</Col>
            <Col span="6">费用类型： {{ headerLineInfo.feeTypeName || '' }}</Col>
            <Col span="6">总金额： {{ headerLineInfo.totalAmount || 0 }}</Col>
            <Col span="6">税额： {{ headerLineInfo.taxAmount || 0 }}</Col>
        </Row>

        <!-- 行登记列表 -->
        <Table class="linecheck" height="300" border :columns="lineCheckColumns"
          :data="lineCheckTableData"></Table>

        <!-- 合计金额展示 -->
        <Row class="expenses" type="flex" justify="start">
            <Col>
              <span>#B费用合计：</span> <span style="color: #fc9153">{{ lineTotalAmount.b }} </span>
            </Col>
            <Col style="margin-left: 25px;">
              <span>#C税额合计：</span> <span style="color: #fc9153">{{ lineTotalAmount.c }} </span>
            </Col>
        </Row>
        
        <div slot="footer">
          <Button type="primary" v-if="!isRead" :loading="checkSaveLoading" @click="saveLineCheckModal">完成</Button>
          <Button type="primary" v-else  @click="closeLineCheckModal">关闭</Button>
        </div>

    </Modal>

  </div>
</template>
<script>
import API from '@/constant/api';
import { invoiceTypeSel, reimbursementTypeLabel } from '../../../../util/helper.js';
// import _ from 'lodash'
// import { trimStr } from '../../../util/helper.js'
import _ from 'lodash';
import { expensesDetailsColumns,
rushLoanColumns,
writeOffLoanColumns,
writeOffLoanColumns2,
relatedTravelApplicationColumns,
relatedTravelRequisitionColumns,
invoiceColumnsP, invoiceColumnsZ,
ruleExecutionResultColumns,
onlineProcessColumns,
offlineProcessColumns,
TransferredLoanSlipColumns,
travelItinerarysColumns,
requisitionColumns,
relationInvoicesColumns,
commonImgColumns, lineColumns,
lineCheckColumns
} from './list.config.js';
// 令才相关
import { lodgingColumens, taxicabColumens, smartProcessColumns, freightColumens, medicalColumens,
  trainColumens, planeColumens, netColumens, otherColumens, vehicleColumens, punishColumens,
  decisionColumens } from './smart.config.js';
import { setTimeout } from 'timers';
import axios from 'axios';
import { on, off, rafThrottle } from '../../../../util/ImgUtil.js';
import { formatNum } from '../../../../util/numberUtil.js';
let CancelToken = axios.CancelToken;
export default {
  data () {
    return {
      lineCheckTypes: [ // 行登记#A类型下拉枚举
        { name: '无票支付', code: '无票支付' },
        { name: '备注栏不合规', code: '备注栏不合规' },
        { name: '发票内容不符', code: '发票内容不符' }
      ],
      checkSaveLoading: false, // 点击完成按钮loading
      editLoading: false, // 行登记添加loading
      headerLineInfo: {}, // 行登记头信息
      lineCheckModal: false, // 行登记弹窗状态
      lineCheckTableData: [], // 行登记列表展示
      pollingST: null, // 轮询中的定时器
      destory: true,
      smartMonth: [],
      invoiceZ: 0,
      invoiceP: 0,
      // 智能审核单据list
      dataCity: [],
      smartOnlyState: false, // 当前是否已经有正在编辑的发票
      smartDataLoading: false, // 智能审核loding
      smartCorrect: '未通过', // 智能审核仅查看未通过
      smartSharingOlineDate: [], // 令才执行列表
      lodgingListData: [], // 住宿
      taxicabListData: [], // 出租车
      trainListData: [], // 火车
      planeListData: [], // 机票
      netListData: [],  // 网约车
      freightData: [],  // 货物运输电子货票收款凭证
      vehicleData: [],  // 过路过桥费
      medicalData: [],  // 医疗票据
      punishData: [],  // 行政处罚票据
      decisionData: [],  // 行政处罚决定书
      otherListData: [], // 其他
      empStatus: 1, // 提交人是否离职  默认离职1
      lineListData: [], // 还款单行信息列表
      lineEditData: null, // 还款单当前编辑流水行
      reimbursementTypeLabel: reimbursementTypeLabel,
      breadcrumb1: '',
      breadcrumb2: '',
      checkSpec: '普票',
      rule: 2,
      rejectPeople: 1,
      isRead: true,
      showImgBtn: false,
      auditPassDrawer: false,
      rejectDrawer: false,
      editReferralModel: false,
      // 纸质流转方式展示
      referralNotice: {
        receiptNo: '',
        receiveAddress: '',
        receiveMobile: '',
        receiveName: '',
        referralType: ''
      },
      additionalSignatureDrawer: false,
      signLoading: false,
      addnewLoading: false,
      newWin: {},
      additionalSignatureData: {
        handoverPerson: '',
        handoverPersons: [],
        note: '',
        addApproverBack: true
      },
      loading1: false,
      rejectLoading: false,
      paperLoading: false,
      selectReceiptNo: [],
      addSignOptions: [],
      invoiceTypeSel: invoiceTypeSel,
      formInfoFormRoute: {},
      routeParams: {
        receiptNo: '',
        type: ''
      },
      basicMassege: [], // 基本信息 单据编号下面框框
      auditPassDrawerNote: '', // 审核通过的处理意见
      repayDate: '', // 审核通过的收款日期
      serialNo: '', // 审核通过的交易流水号
      repaymentAccount: '', // 审核通过的收款实际账号
      formBaseInfo: [], // 基础信息附件展示 判断数组
      taskSharingOfflineDate: [], // 线下表格数据
      taskSharingOlineDate: [], // 线上
      TransferredLoanSlipDate: [], // 被转移借款单
      // 费用明细列表数据
      expensesDetailsTableDataReal: [],
      showNoInvoice: false,
      invoiceInformationDate: [], // 发票信息
      editDetailsArr: [], // 费用明细编辑取消
      zifu: '',
      editDetailsArr2: [], // 发票信息编辑取消
      zifu2: '',
      relatedTableTaxSumD: 0, // 发票信息 计算总金额
      delSubject: {},
      ruleTableData: [], // 规则执行
      expensesDetailsTableData2: [
        {
          invoiceNumber: '323452624525',
          invoiceCode: '63562624525',
          invoiceDate: '2019-11-29',
          purchaserName: '王鑫',
          sellerName: '李四',
          invoiceState: '已收单',
          receiptNo: '2'
        },
        {
          invoiceNumber: '323452624525',
          invoiceCode: '63562624525',
          invoiceDate: '2019-11-29',
          purchaserName: '刘毅',
          sellerName: '李四',
          invoiceState: '已收单',
          receiptNo: '2'
        }
      ],
      relatedTravelApplicationDate: [], // 关联差旅申请
      relatedTravelRequisitionData: [], // 关联申请
      // 借款列表
      rushLoanTableData: [],
      // 查验状态
      checkStatuses: [
        {
          code: '',
          zValue: '全部',
          eValue: ''
        },
        {
          code: '1',
          zValue: '正常',
          eValue: ''
        },
        {
          code: '2',
          zValue: '异常',
          eValue: ''
        }
      ],
      // 票据种类
      optionList: [

      ],
      // 联次
      isDeductionList: [
        {
          code: 0,
          zValue: '发票联'
        },
        {
          code: 1,
          zValue: '抵扣联'
        },
        {
          code: 2,
          zValue: '报税联'
        },
        {
          code: 3,
          zValue: '记账联'
        }
      ],
      // 普票联次
      isDeductionListP: [
        {
          code: 0,
          zValue: '发票联'
        },
        {
          code: 3,
          zValue: '记账联'
        }
      ],
      // 发票信息列表tab
      invoiceDetailTab: [
        {
          code: '',
          zValue: '面交',
          eValue: ''
        },
        {
          code: '1',
          zValue: '快递',
          eValue: ''
        },
        {
          code: '2',
          zValue: '扫楼',
          eValue: ''
        },
        {
          code: '3',
          zValue: '邮件',
          eValue: ''
        },
        {
          code: '4',
          zValue: 'D群',
          eValue: ''
        }
      ],
      // 发票类型
      invoiceType: [
        {
          code: '专票',
          zValue: '增值税专用发票',
          eValue: '',
          listName: 'invoiceZ'
        },
        {
          code: '普票',
          zValue: '增值税普通发票',
          eValue: '',
          listName: 'invoiceP'
        }
      ],
      // 费用明细编辑
      editInvoice: {
        billNumber: '',
        srmIndirect: '',
        invoiceId: '',
        imgId: ''
      },
      // 发票信息 编辑
      editInvoice2: {
        'invoiceNumber': '',
        'totalNetAmount': '',
        'billingDate': '',
        'checkCode': '',
        'invoiceCode': '',
        'imageRandomCode': '',
        'invoiceType': '',
        'isCompliance': '1',
        imageList: []
      },
      addInvoiceD: {
        'invoiceNumber': '',
        'totalNetAmount': '',
        'billingDate': '',
        'checkCode': '',
        'invoiceCode': '',
        'imageRandomCode': '',
        'invoiceType': '',
        'isCompliance': '1',
        imageList: [ { 'randomCode': '', 'isDeduction': '' }, { 'randomCode': '', 'isDeduction': '' } ]
      },
      querySpecialDate: [], // 专票查询
      imgIdArr: [],
      inputImgId: {
        imgId: ''
      },
      // 查询条件
      formValidate: {
        receiptNo: '',
        // receiptNo: 'ER00698098',
        imgRandomCode: '',
        checkStatus: '',
        invoiceType: '',
        onlyDuplicate: 0,
        onlyElectronic: 0  // 查看电子普票
      },
      rejectDate: {
        sendBackResult: '',
        rejectPeople: '',
        reason: '',
        intelligentReturn: '' // 智能退回勾选

      },
      processing2: [
        {
          code: '影像重扫',
          zValue: '影像重扫',
          eValue: ''
        },
        {
          code: '少票确认',
          zValue: '少票确认',
          eValue: ''
        },
        {
          code: '纸质单据待交',
          zValue: '纸质单据待交',
          eValue: ''
        },
        {
          code: '组内要求退回',
          zValue: '组内要求退回',
          eValue: ''
        }

      ],
      processing3: [
        {
          code: '发票问题',
          zValue: '发票问题',
          eValue: ''
        },
        {
          code: '报销问题',
          zValue: '报销问题',
          eValue: ''
        },
        {
          code: '超标问题',
          zValue: '超标问题',
          eValue: ''
        },
        {
          code: '附件问题',
          zValue: '附件问题',
          eValue: ''
        },
        {
          code: '初审要求退回',
          zValue: '初审要求退回',
          eValue: ''
        },
        {
          code: '其他',
          zValue: '其他',
          eValue: ''
        }
      ],
      processing4: [
        {
          code: '识别或补录错误',
          zValue: '识别或补录错误',
          eValue: ''
        },
        {
          code: '新附件上传',
          zValue: '新附件上传',
          eValue: ''
        }
      ],
      imgsModal: false,
      feeImgs: [],
      locationHost: '',
      auditPassLoading: false,
      referraltypeList: [],
      // isReferralType: '',
      taxRates: [],
      quantile: 0,
      endTimeOptions: {
        disabledDate: date => {
          let startTime = Number(new Date().getTime());
          return date && date.valueOf() > startTime;
        }
      },
      requisitionDatas: {}, // 申请单的业务招待类型数据
      relationModal: false, // 关联发票弹窗展示
      relationInvoices: [], // 列表
      relationInvoiceForm: {
        invoiceCode: '',
        invoiceNumber: ''
      },
      relationInvoiceLoading: false,
      showRelationInvoiceTable: false,
      showTransAmountButtonFlag: false,
      transLoading: false,
      commonImgs: [],
      commonImgModal: false,
      commonImgLoading: false,
      commonImgForm: {
        invoiceCode: ''
      }
    };
  },
  // components: { pdf },
  computed: {
    /**
     * @description 计算行登记#B和#C合计金额
     */
    lineTotalAmount () {
      // 合计金额初始值定义
      const initAmount = { b: 0, c: 0 };
      // 利用reduce方法计算#B及#C合计金额
      return this.lineCheckTableData.reduce(({ b, c }, { bFeeAmount, cTaxAmount }) => (
        { b: b + (bFeeAmount || 0), c: c + (cTaxAmount || 0) }
      ), initAmount);
    },
    /**
     * @description 计算行登记#B和#C合计金额
     */
    lineCtypeTotalAmount () {
      // 利用reduce方法计算#C税额合计金额
      const result = this.expensesDetailsTableData.reduce((pre, cur) =>
          (Number(pre) || 0 + Number(cur.cTotalTaxAmount) || 0), 0);
      return Number(result) || 0;
    },
    /**
     * @description 判断是否是安全类还款单
     */
    safeState () {
      // 判断是否是安全类
      return this.basicMassege.receiptType === '还款单' &&
        [ '安全管理', '代驾安全管理', '海马安全管理' ].includes(this.basicMassege.businessType);
    },
    /**
     * @description 当前选中单据金额和
     * @returns {Number} 计算后的金额总和
    */
    smartTotalAmount () {
      const invoice = this.smartInvoiceType.find(l => l.code === this.checkSpec); // 获取单据信息
      const { code, listName } = invoice;
      const listData = this[listName]; // 获取单据列表数据
      // 查找对应金额key值
      const key = [ '21' ].includes(code) ? 'total' : [ '26' ].includes(code) ? 'sum'
        : [ '22' ].includes(code) ? 'price' : 'totalAmount';
      const result = listData ? listData.reduce((pre, cur) =>
        (Number(pre) || 0) + (Number(cur[key]) || 0), 0) : 0; // 计算总金额
      return formatNum(result || 0, 2);
    },
    /**
     * @description 是否选中智能审核单据
     * @returns {Boolean} true 选中  false 未选中
    */
    checkSpecType () {
      return !([ '普票', '专票' ].includes(this.checkSpec));
    },
    /**
     * @description 是否可以退回人工补录
     * @returns {Boolean} true 可以退回人工补录  false 不可以退回人工补录
    */
    isSupplement () {
      // sendBackNodes 可退回节点
      return this.basicMassege.sendBackNodes && (this.basicMassege.sendBackNodes.includes('firstAudit') ||
      this.basicMassege.sendBackNodes.includes('user')) && this.isSmartInvoice;
    },
    /**
     * @description 是否属于智能审核单据
    */
    isSmartInvoice () {
      return this.basicMassege.isSmartAudit === 1;
    },
    columnsNumber () {
      const lengthObj = {};
      this.smartInvoiceType.forEach(item => {
        lengthObj[item.listName] = this[item.listName].filter(l => !l.isLocalAddRow).length || '';
      });
      const zpInvoiceObj = {
        'invoiceZ': this.invoiceZ || '',
        'invoiceP': this.invoiceP || ''
      };
      return { ...lengthObj, ...zpInvoiceObj };
    },
    /**
     * @description 是否属于智能审核单据
    */
    smartInvoiceType () {
      return [
        {
          code: '23',
          zValue: '住宿水单',
          listName: 'lodgingListData',
          list: this.lodgingListData,
          ocrInvoiceType: [ 'water_bill' ],
          columns: lodgingColumens(this, 'lodgingListData')
        },
        {
          code: '26',
          zValue: '出租车发票',
          listName: 'taxicabListData',
          list: this.taxicabListData,
          ocrInvoiceType: [ 'taxi_ticket' ],
          columns: taxicabColumens(this, 'taxicabListData')
        },
        {
          code: '22',
          zValue: '火车票',
          listName: 'trainListData',
          list: this.trainListData,
          ocrInvoiceType: [ 'train_ticket' ],
          columns: trainColumens(this, 'trainListData')
        },
        {
          code: '21',
          zValue: '机票行程单',
          listName: 'planeListData',
          list: this.planeListData,
          ocrInvoiceType: [ 'air_transport' ],
          columns: planeColumens(this, 'planeListData')
        },
        {
          code: '25',
          zValue: '网约车行程单',
          listName: 'netListData',
          list: this.netListData,
          ocrInvoiceType: [ 'online_car_ticket' ],
          columns: netColumens(this, 'netListData')
        },
        {
          code: '27',
          zValue: '过路过桥费',
          listName: 'vehicleData',
          list: this.vehicleData,
          ocrInvoiceType: [ 'vehicle_toll' ],
          columns: vehicleColumens(this, 'vehicleData')
        },
        {
          code: '28',
          zValue: '行政处罚票据',
          listName: 'punishData',
          list: this.punishData,
          ocrInvoiceType: [ 'administrative_penalty_invoice' ],
          columns: punishColumens(this, 'punishData')
        },
        {
          code: '29',
          zValue: '行政处罚决定书',
          listName: 'decisionData',
          list: this.decisionData,
          ocrInvoiceType: [ 'administrative_penalty_parper' ],
          columns: decisionColumens(this, 'decisionData')
        },
        {
          code: '31',
          zValue: '医疗票据',
          listName: 'medicalData',
          list: this.medicalData,
          ocrInvoiceType: [ 'medical_invoice' ],
          columns: medicalColumens(this, 'medicalData')
        },
        {
          code: '32',
          zValue: '货物运输电子货票收款凭证',
          listName: 'freightData',
          list: this.freightData,
          ocrInvoiceType: [ 'goods_transport_voucher' ],
          columns: freightColumens(this, 'freightData')
        },
        {
          code: '99',
          zValue: '其他',
          listName: 'otherListData',
          list: this.otherListData,
          ocrInvoiceType: [ 'highway_passenger_invoice', 'general_machine_invoice',
            'rebook_ticket', 'quota_invoice' ],
          columns: otherColumens(this, 'otherListData')
        }
      ];
    },
    /**
     * @description 令才规则执行结果
    */
    smartProcessColumns () {
      return smartProcessColumns(this);
    },
    /**
     * @description 令才规则执行结果
    */
    smartFilterData () {
      return this.smartSharingOlineDate.filter(item => this.smartCorrect === '未通过'
        ? item.correct === '未通过' : true);
    },
    // 处理结果
    processing1: function () {
      let all = [
        {
          code: '退回修改',
          zValue: '退回修改',
          eValue: ''
        },
        {
          code: '缺发票/支持性文件',
          zValue: '缺发票/支持性文件',
          eValue: ''
        }
      ];
      if (this.showImgBtn) {
        all.push(
          {
            code: '整单驳回',
            zValue: '整单驳回',
            eValue: ''
          }
        );
      }
      return all;
    },
    expensesDetailsColumns: function () {
      return expensesDetailsColumns(this);
    },
    rushLoanColumns: function () {
      return rushLoanColumns(this);
    },
    writeOffLoanColumns: function () {
      return writeOffLoanColumns(this);
    },
    writeOffLoanColumns2: function () {
      return writeOffLoanColumns2(this);
    },
    relatedTravelApplicationColumns: function () {
      return relatedTravelApplicationColumns(this);
    },
    relatedTravelRequisitionColumns: function () {
      return relatedTravelRequisitionColumns(this);
    },
    // invoiceColumns: function () {
    //   return invoiceColumns(this)
    // },
    invoiceColumnsP: function () {
      return invoiceColumnsP(this);
    },
    /**
     * @description 还款单行信息详情
     */
    lineColumns: function () {
      return lineColumns(this);
    },
    invoiceColumnsZ: function () {
      return invoiceColumnsZ(this);
    },
    ruleExecutionResultColumns: function () {
      return ruleExecutionResultColumns(this);
    },
    onlineProcessColumns: function () {
      return onlineProcessColumns(this);
    },
    offlineProcessColumns: function () {
      return offlineProcessColumns(this);
    },
    TransferredLoanSlipColumns: function () {
      return TransferredLoanSlipColumns(this);
    },
    travelItinerarysColumns: function () {
      return travelItinerarysColumns(this);
    },
    requisitionColumns: function () {
      return requisitionColumns(this);
    },
    relationInvoicesColumns: function () {
      return relationInvoicesColumns(this);
    },
    commonImgColumns: function () {
      return commonImgColumns(this);
    },
    // 行登记列表表头配置
    lineCheckColumns: function () {
      return lineCheckColumns(this);
    },
    expensesDetailsTableData: function () {
      let _show = this.showNoInvoice;

      return this.expensesDetailsTableDataReal.filter(_item => {
        if (_show) {
          return true;
        }
        return _item.patch === 1;
      });
    }
  },
  created () {},
  watch: {
    '$route': 'pageInit',
    newWin (val) {
      window.newWin = val;
    }
  },
  mounted () {
    this.pageInit();
    this.getInvoiceTypeDate();
    // if (this.formInfoFormRoute.fromPath)
    // let routeParams = JSON.parse(this.$route.params.data)
    // if (!routeParams.receiptNo || !routeParams.type) {
    //   return false
    // }
    // this.relatedQuery(routeParams.receiptNo, routeParams.type))
  },
  beforeDestroy () {
    clearTimeout(this.pollingST);
    this.destory = this.pollingST = null;
  },
  methods: {
    /**
     * @description 行登记新增校验
     * @param {Objcet} row 当前添加行信息
    */
    validLineData (row) {
      // 必填校验，金额可以输入任何数字包括0和负数
      const res = [ 'aType', 'bFeeAmount', 'cTaxAmount', 'dRemark' ].every(key => row[key] || row[key] === 0);
      !res && (this.$Message.info('请完善信息')); // 信息提示
      return res;
    },
    /**
     * @description 打开行登记弹窗
     * @param {Object} row 当前费用明细行数据
    */
    openLineCheckModal (row) {
      // 根据费用行信息获取行登记列表数据
      this.headerLineInfo = row; // 暂存当前费用行信息
      this.lineCheckTableData = []; // 首先清除上次行登记信息
      this.$http({
        method: 'get',
        url: API.financeModule.getFeeList,
        params: { feeId: row.feeId }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.lineCheckModal = true; // 打开弹窗
          this.lineCheckTableData = res.data.data; // 初始化行登记信息
          !this.isRead && this.addEditLine(); // 初始化编辑内容
        } else {
          this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      });
    },
    /**
     * @description 给行登记列表添加编辑区域
    */
    addEditLine () {
      // type为edit代表本行可编辑
      this.lineCheckTableData.push({
        aType: '',
        bFeeAmount: '',
        cTaxAmount: '',
        dRemark: '',
        type: 'edit'
      });
    },
    /**
     * @description 点击行登记完成按钮
    */
    saveLineCheckModal () {
      // 校验#A、#B、#C是否符合规则
      if (this.isRepeat() || !this.amountValid()) return;
      // 过滤除添加列外的有效数据
      const sendList = this.lineCheckTableData.filter(l => l.type !== 'edit');
      this.checkSaveLoading = true; // 开始loading
      this.$http({
        method: 'post',
        // 地址参数确定当前行
        url: `${API.financeModule.addFeeList}/${this.headerLineInfo.feeId}`,
        data: sendList.map(( // 只提取需要的字段
          { aType, bFeeAmount, cTaxAmount, dRemark }) => {
          return {
            aType,
            bFeeAmount,
            cTaxAmount,
            dRemark,
            feeId: this.headerLineInfo.feeId,
            receiptNo: this.headerLineInfo.receiptNo
          };
        })
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.lineCheckModal = false; // 关闭弹窗
          this.getReceiptFeeVOS(); // 拉取行信息列表
        } else {
          this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      }).finally(() => { this.checkSaveLoading = false; });
    },
      // 获取费用详情列表
    getReceiptFeeVOS (_type) {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this.$http({
        method: 'get',
        url: API.financeModule.baseReceiptInfo,
        params: obj
      })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            _this.expensesDetailsTableDataReal = res.data.data.receiptFeeVOS;
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    /**
     * @description 校验#A类型是否有重复项
     * @returns {Boolean}
     *    true 代表有重复
     *    false代表没有重复
    */
    isRepeat () {
      let arr = [];
      let i = 0;
      const len = this.lineCheckTableData.length;
      for (; i < len; i++) {
        const item = this.lineCheckTableData[i];
        if (arr.includes(item.aType)) { // 若已经存在这个类型代表重复
          this.$Message.info('请检查#A类型。每一个费用行的行登记内容，#A类型都不可有重复的两条');
          return true; // 有重复
        } else { // 不存在则加入到暂存数组中
          arr.push(item.aType);
        }
      }
      return false; // 数组遍历完后代表没有重复
    },
    /**
     * @description 校验#B和#C是否符合规则
     * @returns {Boolean}
     *    true 代表通过
     *    false代表没有通过
    */
    amountValid () {
      // b = #B合计金额、c = #C合计税额
      const { b, c } = this.lineTotalAmount; // 当前行登记合计金额取值
      // noneTaxAmountReal = 核定不含税金额、taxAmount = 税额
      const { noneTaxAmountReal, taxAmount } = this.headerLineInfo; // 当前操作行信息取值
      // 校验#B费用金额合计是否大于行信息核定不含税金额
      if (b > noneTaxAmountReal) {
        this.$Message.info('#B费用金额合计不可大于核定不含税金额');
        return false;
      }
      // 校验#C税额合计是否大于行信息税额
      if (c > taxAmount) {
        this.$Message.info('#C税额合计不可大于税额');
        return false;
      }

      return true;
    },
    /**
     * @description 获取还款单行信息
    */
    getRepaymentLineInfo () {
      const _this = this;
      _this.$http({
        method: 'get',
        url: API.financeModule.repaymentList,
        params: {
          receiptNo: _this.formInfoFormRoute.docId
        }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.lineEditData = null; // 取消当前编辑行
          let dataSource = res.data.data || []; // 数据
            // 处理无流水行时 操作列不展示问题
          dataSource.forEach((_item, i) => {
            // 判断receiptRepaymentDetailItemList字段为null或者为空数组情况
            if (!_item.receiptRepaymentDetailItemList ||
            _item.receiptRepaymentDetailItemList.length === 0) {
              // 银行转账或意外险赔付单据单独处理
              [ 'bankTransfer', 'insurancePayment' ].includes(_item.repaymentType) &&
              (_item.receiptRepaymentDetailItemList = [ {} ]); // 默认展示一行，便于用户操作新增按钮
            }
          });
          _this.lineListData = dataSource;
        } else {
          this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    /**
     * @description 编辑保存
     * @param {Object} row 当前编辑流水行信息
     * @param {Object} data 对应还款行所有信息
    */
    editWaterLine (row, data) {
      if (!this.validaWaterLine(row)) return;
      const _this = this;
      _this.$set(row, '_prevSecondLoading', true);
      _this.$http({
        method: 'post',
        // isLocalAddRow为true代表新增，反之代表修改
        url: API.financeModule[row.isLocalAddRow ? 'repaymentAdd' : 'repaymentEdit'],
        data
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.lineEditData = null; // 取消当前编辑行
          this.getRepaymentLineInfo(); // 重新拉取列表
          this.$Message.success(res.data.msg);
        } else {
          this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      }).finally(() => { _this.$set(row, '_prevSecondLoading', false); });
    },
    /**
     * @description 流水行数据校验
     * @param {String} data 当前需要校验的流水行信息
     * @returns {Boolean} 校验结果 true(通过)  false(失败)
    */
    validaWaterLine (data) {
      // 需要校验的数据
      const validObj = {
        receiveAmountDate: { title: '还款日期', required: true },
        bankAccount: {
          title: '还款账号',
          required: true,
          valid: val => /^[0-9]*$/.test(val),
          msg: '还款账号仅支持数字输入' },
        runningNo: {
          title: '流水号', // 校验对象表格名称
          required: true, // 是否必填
          valid: val => /^[0-9A-Za-z]*$/.test(val), // 必填后校验
          msg: '流水号仅支持数字 + 字母' }, // 提示信息
        totalAmount: {
          title: '本次认款金额',
          required: true,
          valid: val => (/^(([1-9]{1}\d*)|(0{1}))(.\d{1,2})?$/).test(val + ''),
          msg: '本次认款金额必须大于0，且小数点后最多输入2位' }
      };
      for (const key in validObj) {
        if (Object.hasOwnProperty.call(validObj, key)) {
          // 获取本次校验信息
          const { required, title, valid, msg } = validObj[key];
          if (required) { // 是否必填
            const value = data[key];
            if (value) { // 若值不为空，则进行下一步校验
              const res = valid && valid(value); // 拿到校验结果
              if (!res && valid) { this.$Message.info(msg); return false; } // 校验失败提示
            } else {
              if (key === 'totalAmount') {
                this.$Message.info(`本次认款金额必须大于0，且小数点后最多输入2位`);
              } else {
                title && this.$Message.info(`${title}不能为空`); // 未输入值
              }
              return false;
            }
          }
        }
      }
      return true;
    },
    /**
     * @description 删除流水行
     * @param {Object} item 本行流水行详情
     * @param {Object} data 对应还款行所有信息
    */
    delWaterInvoice (row, data) {
      // const _this = this;
      this.$set(row, '_prevSecondLoading', true);
      this.$http({
        method: 'post',
        url: API.financeModule.repaymentDelete,
        data
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.getRepaymentLineInfo(); // 重新拉取列表
          this.$Message.success(res.data.msg);
        } else {
          this.$Message.warning(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      }).finally(() => { this.$set(row, '_prevSecondLoading', false); });
    },
    /**
     * @description 关闭行登记弹窗
    */
    closeLineCheckModal () {
      this.lineCheckModal = false;
    },
    /**
     * @description 获取月日时间数据
    */
    getDateMonthDay () {
      let date = [];
      for (let i = 0; i < 12; i++) {
        const value = i + 1;
        let month = { value: `${value < 10 ? `0${value}` : value}`, label: `${i + 1}月` };
        let children = [];
        for (let j = 0; j < 31; j++) {
          const value = j + 1;
          let day = { value: `${value < 10 ? `0${value}` : value}`, label: `${j + 1}号` };
          if (j < 29) {
            children.push(day);
          }
          if (j === 29) {
            if (i !== 1) {
              children.push(day);
            }
          }
          if (j === 30) {
            if ([ 1, 3, 5, 7, 8, 10, 12 ].includes(i + 1)) {
              children.push(day);
            }
          }
        }
        month.children = children;
        date.push(month);
      }
      this.smartMonth = date;
    },
    handleSearch (val) {
      this.$http
        .get(API.basisModule.getCityPage, {
          params: { cityName: val.trim(), status: 0, statusFlag: 'enable' }
        })
        .then(res => {
          this.dataCity = res.data.data;
        });
    },
     /**
     * @description 点击规则结果tab单选触发
     */
    changeRule (rule) {
      rule === 4 && this.polling(this.formInfoFormRoute.docId); // 查询执行规则结果是否返回，初始化执行规则按钮状态
    },
    /**
     * @description 智能审核初始化
     *
     */
    smartInit () {
      this.invoiceType = [ ...this.invoiceType, ...this.smartInvoiceType ]; // 添加多种票据类型
      this.getSmartSharingOlineDate(); // 获取执行规则
      this.getInvoiceCount(); // 专普票数量查询
      this.getSmartIncoiceCount(); // 智能审核单据数量查询
      this.getDateMonthDay(); // 默认日期列表
    },
    /**
     * @description 轮询方法，循环调用智能审核执行规则结果是否返回
     * 已经返回则刷新列表，重置执行规则按钮状态
     * 未返回，执行规则按钮仍然处于loading状态
     */
    polling (receiptNo) {
      this.getRuleResult(receiptNo).then(res => {
        if (res.data.code === '100500' && res.data.data === '未返回') { // 结果未返回
          this.smartDataLoading = true;
          this.pollingST = setTimeout(() => {
            this.pollingST && clearTimeout(this.pollingST);
            this.destory && this.polling(receiptNo); // 页面关闭停止定时器
          }, 5000);
        } else { // 结果已返回
          this.smartDataLoading = false;
          this.getSmartDrools(); // 重新获取规则引擎结果
          this.getSmartSharingOlineDate(); // 执行规则结果返回后刷新列表
        }
      }).catch(err => { console.log(err); });
    },
    /**
     * @description 轮询方法，循环调用智能审核执行规则结果是否返回
     * 已经返回则刷新列表，重置执行规则按钮状态
     * 未返回，执行规则按钮仍然处于loading状态
     */
    getRuleResult (receiptNo) {
      return this.$http({
        method: 'get',
        url: API.financeModule.getRuleResult,
        params: { receiptNo }
      });
    },
    /**
     * @description 获取智能审核票据数量
     *
     */
    getSmartIncoiceCount () {
      const _this = this;
      const invoiceTypeList = this.smartInvoiceType.map(item => item.code).join(',');
      // 获取所有数据
      this.$http({
        method: 'get',
        url: API.financeModule.otherInvoiceList,
        params: {
          receiptNo: _this.formInfoFormRoute.docId,
          invoiceTypeList
        }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.smartInvoiceType.forEach(item => {
            this[item.listName] = res.data.data && res.data.data.filter(
                l => item.ocrInvoiceType.includes(l.ocrInvoiceType));
            this[`${item.listName}Clone`] = _.cloneDeep(this[item.listName]);
          });
        } else {
          this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      });
    },
    /**
     * @description 下载附件
     */
    downloadFile (_attachment) {
      if (_attachment.attachmentUrl) {
        window.open(_attachment.attachmentUrl, '_blank');
      }
    },
    /**
     * @description 删除附件
     * @param _ind 要删除的索引
     */
    delFile (_type, _ind) {
      this.delReceiptFile(this.basicMassege.attachmentList[_ind]);
      this.basicMassege.attachmentList.splice(_ind, 1);
    },
    /**
     * @description 新增智能审核单据行
     * @param tableInvoice 单据信息
     */
    addSmartRow ({ columns, listName, ocrInvoiceType, code, zValue }) {
      if (this.smartOnlyState) {
        this.$Message.info('不可同时编辑多行');
        return;
      }
      this.smartOnlyState = true;
      const invoiceTypeName = zValue === '其他' ? '' : zValue;
      const newObj = {  // 默认带有节点
        // invoiceType: code, // type
        isFakeMate: 1, // 当前编辑
        ocrInvoiceType: ocrInvoiceType.length === 1 && ocrInvoiceType[0], // 对于类型编码
        isLocalAddRow: true // 代表是本地新增的数据
      };
      // 遍历columns信息 自动生成初始化对象
      columns && columns.forEach(({ key, childrenKey }) => {
        let childList;
        const defaultValue = [ 'price', 'total', 'totalAmount', 'sum' ].includes(key) ? 0 : '';
        if (childrenKey) { // 是否有子节点
          childList = newObj[key] ? [ { ...(newObj[key][0] || {}), [childrenKey]: defaultValue } ]
              : [ { [childrenKey]: defaultValue } ]; // 子节点是否已经生成数据
        }
        key && (newObj[key] = childrenKey ? childList : defaultValue); // 是否有子节点 赋值不同
        key === 'imageList' && (newObj[key] = []); // 影像编码默认为数组 特殊处理
      });
      this[listName] && this[listName].push({ ...newObj, invoiceTypeName });
    },
    // 附件实时删除更新
    delReceiptFile (_fileItem) {
      const _this = this;
      if (!_this.formInfoFormRoute.docId) {
        return;
      }
      _this.$http({
        method: 'get',
        url: API.financeModule.fileDeleteReceiptAttachment,
        params: {
          receiptNo: _this.formInfoFormRoute.docId,
          attachmentKey: _fileItem.attachmentKey,
          attachmentId: _fileItem.attachmentId,
          relationType: '0'
        }
      })
      .then(res => {
        if (res.data && res.data.code !== '100200') {
          _this.$Message.info(res.data.msg);
        } else {
          // 删除成功后  刷新发票列表
          // 刷新专普票信息
          [ '专票', '普票' ].includes(this.checkSpec) ? this.getInvoiceInformationDate() : this.getInvoiceCount();
          this.getInvoiceTypeDate(); // 获取下拉数据
          this.isSmartInvoice && this.getSmartIncoiceCount(); // 智能审核单据刷新
          // 影像查看页刷新
          this.newWin && this.newWin.location && this.newWin.location.reload && this.newWin.location.reload();
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    /**
     * @description 刷新发票信息及影像查看页
     * @param {Boolean} invoice 是否刷新发票页
     * @param {Boolean} image 是否刷新影像页
     */
    flushed (invoice = true, image = true) {

    },
    pageInit () {
      this.formInfoFormRoute = this.$route.params;

      window.changeItem = this.changeItem;
      this.getReceiptInfo();
      this.getTaskSharingOfflineDate();
      this.getTaskSharingOlineDate();
      this.getruleTableData();

      // this.isReferralTypeF()
      // this.locationHost = window.location.host + '/financeModule/expenseShare/financePaperDocsFill/' + this.formInfoFormRoute.docId + this.basicMassege.receiptType
      switch (this.formInfoFormRoute.fromPath) {
        case 'expenseAccount':
          this.breadcrumb1 = '报销单';
          this.breadcrumb2 = '报销单详情';
          break;
        case 'applicationForm':
          this.breadcrumb1 = '申请单';
          this.breadcrumb2 = '申请单详情';
          break;
        case 'loanForm':
          this.breadcrumb1 = '借款单';
          this.breadcrumb2 = '借款单详情';
          break;
        case 'repaymentForm':
          this.breadcrumb1 = '还款单';
          this.breadcrumb2 = '还款单详情';
          break;
        case 'loanTransfer':
          this.breadcrumb1 = '借款转移申请单';
          this.breadcrumb2 = '借款转移申请单详情';
          break;
        case 'securityManagement':
          this.breadcrumb1 = '安全管理还款单';
          this.breadcrumb2 = '安全管理还款单详情';
      }
      this.$route.meta.parent = '/financeModule/expenseShare/' + this.formInfoFormRoute.fromPath;
      this.$route.meta.name = [ '费用共享', this.breadcrumb1, this.breadcrumb2 ];
    },
     /**
     * @description 获取头信息 规则引擎及审核结果字段
     */
    getSmartDrools () {
      const _this = this;
      _this.$http({
        method: 'get',
        url: API.financeModule.baseReceiptInfo,
        params: {
          receiptNo: _this.formInfoFormRoute.docId
        }
      })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data ? res.data.data : {};
            _this.basicMassege.autoAuditDrools = dataSource.autoAuditDrools;
            _this.basicMassege.autoAuditResult = dataSource.autoAuditResult;
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 查询单据基本信息
    getReceiptInfo (_type) {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this.$http({
        method: 'get',
        url: API.financeModule.baseReceiptInfo,
        params: obj
      })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.basicMassege = dataSource ? dataSource.data : {};
            this.requisitionDatas = _this.basicMassege.entertainDetailVO || {}; // 业务招待类型列表
            this.locationHost = `${window.location.host}/financeModule/expenseShare/financePaperDocsFill/${this.formInfoFormRoute.docId}/${this.basicMassege.receiptType}`;
            this.quantile = Number(_this.basicMassege.quantile);

            // 是否展示发票影像按钮
            _this.showImgBtn = _this.basicMassege.imageEmpty === undefined ? false : !_this.basicMassege.imageEmpty;

            // 智能审核单据初始化
            if (this.isSmartInvoice) {
              // 初始化票据类型当前数量
              this.smartInit();
            }
            // 单据类型为还款单的才有行信息
            if ([ '还款单' ].includes(_this.basicMassege.receiptTypeName)) {
              this.getRepaymentLineInfo();
            }

            // 只读控制 ===
            if (this.formInfoFormRoute.fromPath === 'myTasks') {
              // 编辑中和审核通过状态只读
              if ([ 1, 5 ].indexOf(_this.basicMassege.receiptStatus) !== -1 || _this.basicMassege.currentNode === 2 || _this.basicMassege.isHandle) {
                this.isRead = true;
              } else {
                this.isRead = false;
                this.getAllTaxRate();
              }
            } else {
              this.isRead = true;
            }
            // 只读控制 ===

            _this.expensesDetailsTableDataReal = dataSource.data.receiptFeeVOS;
            if (_this.formInfoFormRoute.fromPath === 'myTasks') {
              switch (_this.basicMassege.receiptTypeName) {
                case '报销单':
                  this.breadcrumb1 = '报销单';
                  this.breadcrumb2 = '报销单审批';
                  break;
                case '差旅报销单':
                  this.breadcrumb1 = '报销单';
                  this.breadcrumb2 = '差旅报销单审批';
                  break;
                case '差旅申请单':
                  this.breadcrumb1 = '差旅申请单';
                  this.breadcrumb2 = '差旅申请单审批';
                  break;
                case '申请单':
                  this.breadcrumb1 = '申请单'; // 新加申请单类型
                  this.breadcrumb2 = '申请单审批';
                  break;
                case '借款单':
                  this.breadcrumb1 = '借款单';
                  this.breadcrumb2 = '借款单审批';
                  break;
                case '还款单':
                  this.breadcrumb1 = '还款单';
                  this.breadcrumb2 = '还款单审批';
                  break;
                case '借款转移申请单':
                  this.breadcrumb1 = '借款转移申请单';
                  this.breadcrumb2 = '借款转移申请单审批';
                  break;
                case '安全管理还款单':
                  this.breadcrumb1 = '安全管理还款单';
                  this.breadcrumb2 = '安全管理还款单审批';
              }
            }

            // 借款
            if ([ '借款单' ].indexOf(_this.basicMassege.receiptTypeName) !== -1) {
              _this.getTaskSharingLoanDate();
            }
            // 被借款转移
            if ([ '借款转移', '借款转移申请单' ].indexOf(_this.basicMassege.receiptTypeName) !== -1) {
              _this.getTransferredLoanSlipDate();
            }
             // 关联申请
            if (([ '差旅报销单', '报销单' ].indexOf(_this.basicMassege.receiptTypeName) !== -1) && [ '国内业务招待', '国际业务招待' ].indexOf(_this.basicMassege.businessTypeName) !== -1) {
              _this.getRelatedTravelRequisitionData();
            } else if ([ '差旅报销单' ].indexOf(_this.basicMassege.receiptTypeName) !== -1) { // 差旅报销
              _this.getRelatedTravelApplicationDate();
            }
            // 差旅报销
            if ([ '差旅报销单', '报销单' ].indexOf(_this.basicMassege.receiptTypeName) !== -1) {
              _this.getInvoiceInformationDate();
            }

            if (!_type) {
              // 审核进来默认打开
              if (!this.isRead && this.showImgBtn) {
                this.openImgWin();
              }
            }
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 打开影像查看页面
    openImgWin () {
      if (
        Object.keys(this.newWin).length === 0 ||
        (Object.keys(this.newWin).length >= 0 && this.newWin.closed)
      ) {
        let testPage =
          '/financeModule/docsTransfer/financeOrderScanBrowser/' +
          JSON.stringify({
            receiptNo: this.basicMassege.receiptNo,
            receiptId: '',
            type: this.isRead ? 'read' : 'col',
            pageType: 'verify'
          });
        this.newWin = window.open(`${testPage}`);
      }
    },
    // 跳转到上传电子发票页面
    uploadElectronicInvoice () {
      const tempPage = '/financeModule/expenseShare/uploadElectronicInvoice/' + this.basicMassege.receiptNo;
      this.newWin = window.open(`${tempPage}`);
    },
    // 借款单详情页面-借款行查询数据接口
    getTaskSharingLoanDate () {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.taskSharingLoanDate,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.rushLoanTableData = dataSource ? dataSource.data : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 线下流转记录表格查询数据接口
    getTaskSharingOfflineDate () {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.taskSharingOffline,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.taskSharingOfflineDate = dataSource ? dataSource.data : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 规则执行按钮
    doRule () {
      const _this = this;
      if (this.rule === 4) {
        this.doSmartRule();
        return;
      }
      _this
        .$http({
          method: 'post',
          url: API.financeModule.executeAuto,
          params: {
            receiptNo: this.formInfoFormRoute.docId
          }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            this.getruleTableData();
            // this.referraltypeList = res.data.data || []
          } else {
            _this.$Message.info(res.data.msg);
            return false;
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    /**
     * @description 智能审核单据执行规则
    */
    doSmartRule () {
      const _this = this;
      _this.smartDataLoading = true;
      _this
        .$http({ // 这个接口就是触发执行规则动作，触发完成后就可以轮询去获取结果了
          method: 'get',
          url: API.financeModule.executeSmartAuto,
          params: {
            receiptNo: this.formInfoFormRoute.docId
          }
        }).finally(() => {
          this.polling(this.formInfoFormRoute.docId); // 直接轮询去获取结果
        });
    },
    // 规则执行表格查询数据接口
    getruleTableData () {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.selectByReceiptNo,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.ruleTableData = dataSource ? dataSource.data : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 线上流转记录表格查询数据接口
    getTaskSharingOlineDate () {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.taskSharingOnline,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.taskSharingOlineDate = dataSource ? dataSource.data : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    /**
     * @description 获取令才执行规则执行结果
     */
    getSmartSharingOlineDate () {
      const _this = this;
      this.smartCorrect = '未通过'; // 默认仅查看未通过结果
      this.smartDataLoading = true;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.smartSharingOnline,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.smartSharingOlineDate = dataSource ? dataSource.data : [];
          } else {
            _this.$Message.info(res.data.msg);
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        }).finally(() => { this.smartDataLoading = false; });
    },
    // 被转移借款单表格查询数据接口
    getTransferredLoanSlipDate () {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.taskSharingLoanTransferList,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.TransferredLoanSlipDate = dataSource ? dataSource.data : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 关联申请单表格查询数据接口, 新加类型国内业务招待businessTypeName
    getRelatedTravelRequisitionData () {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.getRelatedTravelRequisitionData,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.relatedTravelRequisitionData = dataSource
              ? dataSource.data
              : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 关联差旅申请单表格查询数据接口
    getRelatedTravelApplicationDate () {
      const _this = this;
      let obj = {
        receiptNo: this.formInfoFormRoute.docId
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.taskSharingTravelApplyByTravel,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.relatedTravelApplicationDate = dataSource
              ? dataSource.data
              : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 是否展示纸质填写链接
    // isReferralTypeF () {
    //   const _this = this
    //   let obj = {
    //     receiptNo: this.basicMassege.receiptType
    //   }
    //   _this
    //     .$http({
    //       method: 'get',
    //       url: API.financeModule.isReferralType,
    //       params: obj
    //     })
    //     .then(res => {
    //       if (res.data && res.data.code === '100200') {
    //         const dataSource = res.data
    //         _this.isReferralType = dataSource ? dataSource.data : []
    //         // _this.finBaseTablePagination.TOTAL = dataSource.total、
    //       }
    //     })
    //     .catch(err => {
    //       _this.$Message.warning(err.response.data.msg)
    //     })
    // },
    // 跳转纸质转交填写
    toPaperFill () {
      this.$router.push({ name: 'financePaperDocsFill', params: { 'docId': this.formInfoFormRoute.docId, 'receiptType': this.basicMassege.receiptType } });
    },
    // 发票信息表格查询数据接口
    getInvoiceInformationDate () {
      const _this = this;
      if (this.checkSpecType) {
        this.getSmartInvoiceList();
        return;
      }
      this.getInvoiceCount(); // 专普票数量更新
      let obj = {
        receiptNo: _this.formInfoFormRoute.docId,
        imgRandomCode: this.formValidate.imgRandomCode || null,
        checkStatus: this.formValidate.checkStatus || null,
        clazzType: this.checkSpec || null,
        // invoiceType: '03',
        onlyDuplicate: this.formValidate.onlyDuplicate || null,
        onlyElectronic: this.formValidate.onlyElectronic || null
      };
      _this.$http({
        method: 'get',
        url: API.financeModule.taskSharingInvoiceList,
        params: obj
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          _this.addnewLoading = false;
          const dataSource = res.data;
          _this.invoiceInformationDate = dataSource ? dataSource.data : [];
          _this.invoiceInformationDate.map(_item => {
            _item.isFakeMate = 0;
          });

          _this.getShowTransAmountButton();
          this.taxShow();
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    /**
     * @description 获取发票信息数量
    */
    getInvoiceCount () {
      const _this = this;
      const forEachList = [
        { name: '专票', listName: 'invoiceZ' },
        { name: '普票', listName: 'invoiceP' }
      ];
      forEachList.forEach(item => {
        const mustObj = {
          receiptNo: _this.formInfoFormRoute.docId,
          clazzType: item.name
        };
        const otherObj = _this.checkSpec === item.name ? {
          imgRandomCode: _this.formValidate.imgRandomCode || null,
          checkStatus: _this.formValidate.checkStatus || null,
          onlyDuplicate: _this.formValidate.onlyDuplicate || null,
          onlyElectronic: _this.formValidate.onlyElectronic || null
        } : {};
        _this.$http({
          method: 'get',
          url: API.financeModule.getInvoiceCount,
          params: { ...mustObj, ...otherObj }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            _this[item.listName] = res.data.data;
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
      });
    },
    // 发票信息专票查询数据接口
    getQuerySpecialDate (_row) {
      const _this = this;
      let obj = {
        invoiceNumber: _row.invoiceNumber,
        invoiceCode: _row.invoiceCode
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.querySpecial,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.querySpecialDate = dataSource ? dataSource.data : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 发票信息专票普票具体类型下拉框
    getInvoiceTypeDate (_row) {
      const _this = this;
      let obj = {
        clazzType: this.checkSpec
      };
      _this
        .$http({
          method: 'get',
          url: API.financeModule.queryInvoiceTypeByType,
          params: obj
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            const dataSource = res.data;
            _this.optionList = dataSource ? dataSource.data : [];
            // _this.finBaseTablePagination.TOTAL = dataSource.total、
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 两个tab页金额展示
    taxShow () {
      let _sum2 = 0;
      for (let i = 0; i < this.invoiceInformationDate.length; i++) {
        _sum2 += Number(this.invoiceInformationDate[i].totalAmount);
      }
      this.relatedTableTaxSumD = (Number(_sum2)).toLocaleString('en-US', { minimumFractionDigits: 2 });
    },
    // 发票信息切换tab页
    changeInvoiceInformationDate (val) {
      const whiteInvoice = [ '专票', '普票' ];
      this.smartOnlyState = false; // 重置正在编辑
      if (whiteInvoice.includes(val)) { // 专普票接口查询
        this.getInvoiceInformationDate();
        this.getInvoiceTypeDate();
      } else { // 令才其他类型票据查询
        this.getSmartInvoiceList(val);
      }
    },
    /**
     * @description 编辑保存
     * @param {String} listName 列表名称
     * @returns
    */
    validaList (row, listName) {
      // 获取对应单据信息
      const smartInvoice = this.smartInvoiceType.find(l => l.listName === listName);
      const columns = smartInvoice && smartInvoice.columns; // 获取单独表头数据
      const requireData = columns && columns.filter(r => r.require); // 获取必填校验数据
      let result = true;
      for (let i = 0; i < requireData.length; i++) {
        result = this.assignment(requireData[i], row, listName); // 获取校验结果
        if (!result) { break; }// 不符合校验结果 跳出循环
      }
      return result;
    },
    /**
     * @description 必填校验
     * @param {String} item 单据所有信息
     * @param {String} row 当前校验数据
     * @param {String} listName 列表名称
    */
    assignment (item, row, listName) {
      const value = row[item.key];
      if (value) { // 如果有值 看是否对值有特殊校验
        if (item.key === 'imageList') { // 都有影像编码 统一管理
          const status = value && value.length > 0;
          !status && (this.$Message.info('影像编码不能为空')); // 未通过校验提示
          return status;
        }
        // 金额校验
        if ([ 'price', 'total', 'totalAmount', 'sum' ].includes(item.key)) { // 金额不能小于0
          if (value <= 0) {
            const msg = [ 'netListData', 'lodgingListData' ].includes(listName) ? '不能小于0' : '必须大于0';
            this.$Message.info(`${item.title}${msg}`);
            return false;
          }
          const status = (/^(([1-9]{1}\d*)|(0{1}))(.\d{1,2})?$/).test(value + '');
          !status && (this.$Message.info(`${item.title}最多保留两位小数`)); // 未通过校验提示
          return status;
        }
        return this[`${listName}Valid`] ? this[`${listName}Valid`](item, row, value) : true;
      } else { // 若值为空 直接返回及提示
        // 其他类型比较特殊 有个别类型不需要
        if (listName === 'otherListData' && item.key === 'date' && [ 'quota_invoice', 'rebook_ticket' ].includes(row.ocrInvoiceType) &&
          !row.date) {
          return true;
        }
        // 个别单据(住宿水单，网约行程单)金额可以为0
        if ([ 'price', 'total', 'totalAmount', 'sum' ].includes(item.key) && value === 0 &&
          [ 'netListData', 'lodgingListData' ].includes(listName)) {
          return true;
        }
        // 过路过桥费票据日期或票据时间有一个即可
        if ([ 'date', 'time' ].includes(item.key) && [ 'vehicleData' ].includes(listName)) {
          const dateState = row.date || row.time; // 日期和时间有一个填写了
          !dateState && this.$Message.info(`票据日期或票据时间不可为空`);
          return dateState;
        }
        const msg = typeof value === 'number' ? '不能为0' : '不能为空';
        this.$Message.info(`${item.title}${msg}`);
        return false;
      }
    },
    /**
     * @description 住宿水单特殊校验
    */
    lodgingListDataValid (colum, row, value) {
      let msg = '';
      let status = true;
      const validData = { // 归总校验规则
        dateStart () { // 入住日期小于等于离店日期
          const dateStart = Date.parse(row.dateStart); // 入住日期
          const endStart = Date.parse(row.dateEnd); // 离店日期
          msg = '入住日期小于等于离店日期';
          status = dateStart <= endStart;
        },
        detailList () { // 消费日期不能为空
          msg = '消费日期不能为空';
          status = value && value.every(l => l.itemDate);
        },
        totalStayDays () { // 消费日期不能为空
          msg = '入住总天数必须大于零';
          status = value && value > 0;
        }
      };
      validData[colum.key] && validData[colum.key](); // 开始校验
      !status && (this.$Message.info(msg)); // 未通过校验提示
      return status;
    },
    /**
     * @description 机票特殊校验
    */
    planeListDataValid (colum, row, value) {
      let msg = '';
      let status = true;
      const validData = { // 归总校验规则
        flightDataList () {
          msg = `${colum.title}不能为空`;
          status = value && value.every(l => colum.childrenKey && l[colum.childrenKey]);
        },
        eTicketNo () {
          msg = `${colum.title}必须是13位数字`;
          status = value && /^\d{13}$/.test(value);
        }
      };
      validData[colum.key] && validData[colum.key](); // 开始校验
      !status && (this.$Message.info(msg)); // 未通过校验提示
      return status;
    },
    /**
     * @description 医疗票据特殊校验
    */
    medicalDataValid (colum, row, value) {
      let msg = '';
      let status = true;
      const validData = { // 归总校验规则
        detailList () {
          msg = `${colum.title}不能为空`;
          status = value && value.every(l => colum.childrenKey && l[colum.childrenKey]);
        }
      };
      validData[colum.key] && validData[colum.key](); // 开始校验
      !status && (this.$Message.info(msg)); // 未通过校验提示
      return status;
    },
    /**
     * @description 网约车特殊校验
    */
    netListDataValid (colum, row, value) {
      let msg = '';
      let status = true;
      const validData = { // 归总校验规则
        detailList () {
          msg = `${colum.title}不能为空`;
          status = value && value.every(l => colum.childrenKey && l[colum.childrenKey]);
        },
        dateStart () { // 行程开始日期小于等于行程结束日期
          const dateStart = Date.parse(row.dateStart); // 行程开始日期
          const endStart = Date.parse(row.dateEnd); // 行程结束日期
          msg = '行程开始日期小于等于行程结束日期';
          status = dateStart <= endStart;
        }
      };
      validData[colum.key] && validData[colum.key](); // 开始校验
      !status && (this.$Message.info(msg)); // 未通过校验提示
      return status;
    },
    /**
     * @description 火车票特殊校验
    */
    trainListDataValid (colum, row, value) {
      let msg = '';
      let status = true;
      const validData = { // 归总校验规则
        ticketId () {
          msg = `请输入正确的${colum.title}`;
          status = (/^[a-zA-Z0-9]{21}$/g).test(value);
        }
      };
      validData[colum.key] && validData[colum.key](); // 开始校验
      !status && (this.$Message.info(msg)); // 未通过校验提示
      return status;
    },
    /**
     * @description 编辑保存
     * @param {String} data 当前保存信息
     * @param {String} listName 列表名称
    */
    editSmartInvoice (data, listName) {
      if (!this.validaList(data, listName)) return;
      const _this = this;
      _this.$set(data, '_prevSecondLoading', true);
      const filterData = this.deleteOtherAttr(data);
      const sendData = {
        receiptNo: _this.formInfoFormRoute.docId,
        invoiceId: filterData.invoiceId || '',
        ocrInvoiceType: filterData.ocrInvoiceType || null,
        invoiceType: filterData.invoiceType || '',
        imageRandomCode: filterData.imageList.map(l => l.randomCode).join(','),
        invoiceContent: filterData
      };
      _this.$http({
        method: 'put',
        url: API.financeModule[data.isLocalAddRow ? 'otherInvoiceAdd' : 'otherInvoiceEdit'],
        data: sendData
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          _this.smartOnlyState = false;
          this.getSmartInvoiceList();
          this.$Message.success(res.data.msg);
        } else if ([ 'EDIT_OTHER_INVOICE_ERROR', 'ADD_OTHER_INVOICE_ERROR' ].includes(res.data.code)) {
          this.$Message.info(res.data.msg);
          this.getSmartInvoiceList();
        } else {
          this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      }).finally(() => { _this.$set(data, '_prevSecondLoading', false); });
    },
    /**
     * @description 删除一些只前端用的属性
     * @param data 需要过滤的数据
     * @returns 返回过滤后的对象
    */
    deleteOtherAttr (data) {
      let send = _.cloneDeep(data);
      [ 'isLocalAddRow', 'isFakeMate', '_index', '_prevSecondLoading', '_rowKey', 'smartMonthFront' ].forEach(key => {
        delete send[key];
      });
      return send;
    },
    /**
     * @description 智能审核其他类型票据查询
     * @param {String} code 单据枚举类型
    */
    getSmartInvoiceList (code) {
      const _this = this;
      const invoiceType = code || this.checkSpec;
      const params = {
        receiptNo: _this.formInfoFormRoute.docId,
        invoiceType
      };
      _this.$http({
        method: 'get',
        url: API.financeModule.otherInvoiceList,
        params
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.smartOnlyState = false;
          let dataSource = res.data.data || []; // 数据
          dataSource.map((_item, i) => {
            dataSource[i] = this.deleteOtherAttr(_item);
            dataSource[i].isFakeMate = 0;
          });// 当前操作状态
          const invoceType = this.smartInvoiceType.find(l => l.code === invoiceType); // 获取当前票据数据源
          if (this[invoceType.listName]) {
            this[invoceType.listName] = dataSource;
            this[`${invoceType.listName}Clone`] = _.cloneDeep(this[invoceType.listName]);
          }
        } else {
          this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    /**
     * @description 用户是否确认删除
     * @param {String} row 单据信息
    */
    confirmSmartDel (row) {
      //
      this.$Modal.confirm({
        title: '操作',
        content: '<p>是否确认删除</p>',
        onOk: () => {
          this.delSmartInvoice(row);
        },
        onCancel: () => {
          this.$Message.info('删除已取消');
        }
      });
    },
        // 删除调接口
    delSmartInvoice (row) {
      const _this = this;
      this.$set(row, '_prevSecondLoading', true);
      this.$http({
        method: 'delete',
        url: API.financeModule.taskSharingDeleteInvoice,
        params: {
          invoiceId: row.invoiceId,
          receiptNo: _this.formInfoFormRoute.docId
        }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.getSmartInvoiceList();
          this.$Message.success(res.data.msg);
        } else {
          this.$Message.warning(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      }).finally(() => { this.$set(row, '_prevSecondLoading', false); });
    },
     // 是否认证
    attestation (_subject) {
      this.$http({
        method: 'put',
        url: API.financeModule.updateAuthStatus,
        params: {
          invoiceId: _subject.invoiceId,
          authStatus: _subject.authVerifyStatus,
          receiptNo: this.formInfoFormRoute.docId
        }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.$Message.success('操作成功');
          // this.getInvoiceInformationDate()
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      });
    },
    // 发票信息查验(单选，多选)
    checkInvoice (_type, _subject) {
      const obj = [];
      if (_type === 'one') {
        obj.push(_subject.invoiceId);
      } else if (_type === 'more') {
        if (!this.selectReceiptNo.length) {
          this.$Message.success('请勾选要查验的发票数据');
          return false;
        } else {
          for (let i = 0; i < this.selectReceiptNo.length; i++) {
            obj.push(this.selectReceiptNo[i].invoiceId);
          }
        }
      }

      this.$http({
        method: 'post',
        url: API.financeModule.taskSharingCheckInvoice,
        data: obj,
        params: {
          receiptNo: this.formInfoFormRoute.docId
        }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.$Message.info(res.data.msg);
          this.getInvoiceInformationDate();
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      });
    },
    // 选择上查下查处理
    changeDropdownItem (_val) {
      this.$router.push({
        name: 'relatedQuery',
        params: {
          data: JSON.stringify({
            receiptNo: this.formInfoFormRoute.docId,
            type: _val
          })
        }
      });
    },
    // 勾选处理
    changeSelect (_sec) {
      this.selectReceiptNo = _sec;
    },
    // 费用明细 编辑保存按钮
    savaInput (index) {
      const _this = this;
      if (
        !(
          _this.editInvoice.noneTaxAmountReal !== '' &&
          _this.editInvoice.taxRateReal !== '' &&
          _this.editInvoice.nonInvoiceAmount !== '' &&
          _this.editInvoice.taxAmount !== ''
        )
      ) {
        _this.$Message.warning('编辑信息不能为空');
        return false;
      }

      let obj = {
        'receiptNo': this.formInfoFormRoute.docId,
        'feeId': this.editInvoice.feeId,
        'noneTaxAmountReal': this.editInvoice.noneTaxAmountReal,
        'taxRateReal': this.editInvoice.taxRateReal,
        'nonInvoiceAmount': this.editInvoice.nonInvoiceAmount,
        'remarkAmount': this.editInvoice.remarkAmount || 0,
        'taxAmount': this.editInvoice.taxAmount,
        'remark': this.editInvoice.remark
      };
      return this.$http({
        method: 'put',
        url: API.financeModule.upadteReceiptFee,
        data: obj
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.$Message.success('操作成功');
          this.getReceiptInfo('row');
          // if (this.checkSpec === 1) {
          //   this.generalTableData[index].isEdit = false
          // } else {
          //   this.specialTableData[index].isEdit = false
          // }
          // this.showTableDate(1)
        } else {
          this.$Message.warning(res.data.msg);
        }
      }).catch((e) => {
        this.$Message.warning(e);
      });
    },
    // 发票信息 编辑保存按钮
    savaInput2 (row, index) {
      const _this = this;
      // if (
      //   !(_this.editInvoice2.billingDate && _this.editInvoice2.checkCode && _this.editInvoice2.invoiceCode && _this.editInvoice2.imageRandomCode &&
      //     _this.editInvoice2.invoiceNumber && _this.editInvoice2.totalNetAmount)) {
      //   _this.$Message.warning('编辑信息不能为空')
      //   return false
      // }
      const imgList = _this.editInvoice2.imageList;
      const imageRandomCode = imgList.map(l => l.randomCode).join(',');
      // 增值税电子专票类型默认赋值发票联
      // 普票联次默认赋值
      if (this.checkSpec === '普票' || this.editInvoice2.invoiceType === '08') {
        imgList.forEach(l => { l.isDeduction = l.isDeduction || 0; });
      }
      let obj = {
        'invoiceId': row.invoiceId,
        'receiptNo': this.formInfoFormRoute.docId,
        'invoiceNumber': this.editInvoice2.invoiceNumber,
        'totalNetAmount': this.editInvoice2.totalNetAmount,
        // 'billingDate': this.editInvoice2.billingDate,
        'billingDate': this.editInvoice2.billingDate ? new Date(this.editInvoice2.billingDate).format('yyyy-MM-dd hh:mm:ss') : '',
        'checkCode': this.editInvoice2.checkCode,
        'invoiceCode': this.editInvoice2.invoiceCode,
        'imageRandomCode': imageRandomCode,
        'invoiceType': this.editInvoice2.invoiceType,
        'remarkTransAmount': this.editInvoice2.remarkTransAmount,
        'isCompliance': this.editInvoice2.isCompliance,
        'provideCity': this.editInvoice2.provideCity,
        'imageList': imgList
        // 'imageList': [{'randomCode': this.editInvoice2.imageList[0].randomCode, 'isDeduction': this.editInvoice2.imageList[0].isDeduction},
        // {'randomCode': _this.editInvoice2.imageList[1].randomCode, 'isDeduction': this.editInvoice2.imageList[1].isDeduction}]
      };
      return _this.$http({
        method: 'put',
        url: API.financeModule.taskSharingEditInvoice,
        data: obj
      })
      .then(res => {
        if (res.data.code === '100200') {
          _this.$Message.warning(res.data.data);
          row.isFakeMate = 0;
          this.getInvoiceInformationDate();
        } else if ([ 'EDIT_OTHER_INVOICE_ERROR', 'ADD_OTHER_INVOICE_ERROR' ].includes(res.data.code)) {
          this.$Message.info(res.data.msg);
          this.getSmartInvoiceList();
        } else {
          _this.$Message.warning(res.msg || res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      }).finally(() => { row._prevSecondLoading = false; });
    },
    handleClearCurrentRow (row, index, _id) {
      this.tableCol = index + 1;
      this.changeInvoice(row, _id);
    },
    changeInvoice (_invoice, _ids) {
      if (_invoice.isNew) {
        return;
      }
      if (Object.keys(this.newWin).length === 0 || (Object.keys(this.newWin).length >= 0 && this.newWin.closed)) {
        let testPage =
          '/financeModule/docsTransfer/financeOrderScanBrowser/' +
          JSON.stringify({
            receiptNo: this.basicMassege.receiptNo,
            receiptId: '',
            type: this.isRead ? 'read' : 'col',
            pageType: 'verify',
            randomCodeParent: _ids.randomCode
          });
        this.newWin = window.open(`${testPage}`);
      } else {
        this.newWin.changeActiveInvoice(_ids);
      }
    },
    // 新添加一行
    addNewrow () {
      const _this = this;
      _this.addnewLoading = true;
      // if (this.checkSpec === 1) {
      const _newInvoice = _this.invoiceInformationDate[0];
      if (_this.invoiceInformationDate && _this.invoiceInformationDate.length > 0) {
        if (_this.invoiceInformationDate[0].isFakeMate === 2) {
          if (!(_newInvoice.invoiceCode && _newInvoice.invoiceNumber)) {
            _this.$Message.warning('请将新增的发票信息补充完整');
            return false;
          }
        }
      }
      const imageList = this.checkSpec === '普票'
      ? [ { 'randomCode': '', 'isDeduction': '' } ]
      : [ { 'randomCode': '', 'isDeduction': '' }, { 'randomCode': '', 'isDeduction': '' } ];
      _this.invoiceInformationDate.splice(0, 0, {
        'invoiceNumber': '',
        'totalNetAmount': 0,
        'billingDate': '',
        'checkCode': '',
        'invoiceCode': '',
        'imageRandomCode': '',
        'invoiceType': '',
        'remarkTransAmount': 0,
        'isCompliance': '1',
          // taxAmount: this.generalTableData.taxAmount || 0) / 100) === 0 ? '0.00' : _this.changePrice2money(Number(this.generalTableData.taxAmount) / 100),
          // noneTaxAmountShow: (Number(res.data.data.noneTaxAmount || 0) / 100) === 0 ? '0.00' : _this.changePrice2money(Number(res.data.data.noneTaxAmount) / 100),
        isFakeMate: 2,
        isNew: true,
        imageList
      });
      // }

      // if (this.checkSpec === 2) {
      //   let _newInvoice2 = _this.specialTableData[0]
      //   if (_this.specialTableData && _this.specialTableData.length > 0) {
      //     if (_this.specialTableData[0].isFakeMate === 2) {
      //       if (!(_newInvoice2.invoiceCode && _newInvoice2.invoiceNumber)) {
      //         _this.$Message.warning('请将新增的发票信息补充完整')
      //         return false
      //       }
      //     }
      //   }
      //   _this.specialTableData.splice(0, 0, {
      //     invoiceCode: '',
      //     invoicetype: '',
      //     invoiceNumber: '',
      //     noneTaxAmount: '',
      //     noneTaxAmountD: '',
      //     invoiceStatus: '',
      //     taxAmount: '',
      //     taxSum: '',
      //     imgId: '',
      //     invoiceId: '',
      //       // taxAmount: this.generalTableData.taxAmount || 0) / 100) === 0 ? '0.00' : _this.changePrice2money(Number(this.generalTableData.taxAmount) / 100),
      //       // noneTaxAmountShow: (Number(res.data.data.noneTaxAmount || 0) / 100) === 0 ? '0.00' : _this.changePrice2money(Number(res.data.data.noneTaxAmount) / 100),
      //     invoiceDate: '',
      //     isFakeMate: 2,
      //     isNew: true
      //   })
      // }

      // if (this.addInvoiceD.invoiceCode === '' || this.addInvoiceD.invoiceNumber === '') {
      //   this.$Message.warning('新增信息不能为空')
      //   return false
      // }
    },
    // 新增保存
    addNewrowSave () {
      const imageRandomCode = this.addInvoiceD.imageList.map(l => l.randomCode).join(',');
      // 增值税电子专票类型默认赋值发票联
      // 普票联次默认赋值
      if (this.checkSpec === '普票' || this.addInvoiceD.invoiceType === '08') {
        this.addInvoiceD.imageList.forEach(l => { l.isDeduction = l.isDeduction || 0; });
      }
      let obj = {
        'receiptNo': this.formInfoFormRoute.docId,
        'invoiceType': this.addInvoiceD.invoiceType,
        // 'billingDate': this.addInvoiceD.billingDate,
        'billingDate': this.addInvoiceD.billingDate ? new Date(this.addInvoiceD.billingDate).format('yyyy-MM-dd 00:mm:ss') : '',
        'checkCode': this.addInvoiceD.checkCode,
        'invoiceCode': this.addInvoiceD.invoiceCode,
        'imageRandomCode': imageRandomCode,
        'invoiceNumber': this.addInvoiceD.invoiceNumber,
        'totalNetAmount': this.addInvoiceD.totalNetAmount,
        'remarkTransAmount': this.addInvoiceD.remarkTransAmount,
        'isCompliance': this.addInvoiceD.isCompliance,
        'imageList': this.addInvoiceD.imageList,
        'provideCity': this.addInvoiceD.provideCity
      };
      return this.$http({
        method: 'post',
        url: API.financeModule.taskSharingAddInvoice,
        data: obj
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.$Message.info(res.data.msg);
          this.getInvoiceInformationDate();
          if (this.invoiceInformationDate.length) {
            this.invoiceInformationDate[0].isFakeMate = 0;
            this.addnewLoading = false;
          }

          // this.showTableDate(1)
          // this.tableChange()
        } else if ([ 'EDIT_OTHER_INVOICE_ERROR', 'ADD_OTHER_INVOICE_ERROR' ].includes(res.data.code)) {
          this.$Message.info(res.data.msg);
          this.getInvoiceInformationDate();
        } else {
          this.$Message.warning(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      });
    },
    // 删除影像编号
    // deleteImgList (index) {
    //   _this.invoiceInformationDate[params.index].imageList.splice(index, 1)
    // },
        // 是否确认删除弹窗
    confirmDel (index) {
      //
      this.$Modal.confirm({
        title: '操作',
        content: '<p>是否确认删除</p>',
        onOk: () => {
          this.delSubjectOK(index);
        },
        onCancel: () => {
          this.$Message.info('删除已取消');
        }
      });
    },
        // 删除调接口
    delSubjectOK (index) {
      this.$http({
        method: 'delete',
        url: API.financeModule.taskSharingDeleteInvoice,
        params: {
          invoiceId: index.invoiceId,
          receiptNo: this.formInfoFormRoute.docId
        }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          for (let i = this.invoiceInformationDate.length - 1; i >= 0; i--) {
            if (this.invoiceInformationDate[i].invoiceId === index.invoiceId) {
              this.invoiceInformationDate.splice(i, 1);
            }
          }
          // this.showTableDate(1)
          // this.$Message.info(res.data.msg)
          this.getInvoiceInformationDate();
        } else {
          this.$Message.warning(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.warning(err.response.data.msg);
      });
    },
    // 附件下载
    openFile (_link) {
      if (_link) {
        window.open(_link);
      }
    },
    // 审核通过
    auditPass () {
      const _this = this;
      _this.auditPassDrawer = true;
    },
    // 审核通过校验之前校验：当前单据存在比对未通过的规则，是否仍审核通过
    auditPassDrawerOkBox () {
      const _this = this;
      // 请求接口 如果isRulePass 1：存在不符合的规则 0：全部规则都符合
      _this.$http({
        method: 'get',
        url: API.financeModule.isHasErrorRules,
        params: {
          receiptNo: _this.basicMassege.receiptNo
        }
      })
      .then(res => {
        // ("isRulePass","1");有校验未通过的规则
        // ("isRulePass","0");全部规则都校验通过
        if (res.data.isRulePass === '1') {
          // 为1则弹窗提示
          _this.$Modal.confirm({
            title: '操作',
            content: '<p>当前单据存在比对未通过的规则，是否仍审核通过</p>',
            onOk: () => {
              _this.auditPassDrawerOk();
            },
            onCancel: () => {
              _this.$Message.info('审核通过已取消');
            }
          });
        } else if (res.data.isRulePass === '0') {
          _this.auditPassDrawerOk();
        }
      }).catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    auditPassDrawerOk () {
      const _this = this;
      // 当前节点为资金审核且单据类型不为还款单的时候不需要传流水
      const waterLineFlag = (_this.basicMassege.flowNodeType === 'cash' &&
        _this.basicMassege.receiptTypeName !== '还款单');
      if (waterLineFlag) {
        if (!_this.repayDate || !_this.serialNo) {
          _this.$Message.info('请将信息补充完整');
          return false;
        }
      }
      _this.auditPassLoading = true;
      _this
        .$http({
          method: 'post',
          url: API.financeModule.verifyPass,
          data: {
            receiptNo: _this.formInfoFormRoute.docId,
            actionMessage: _this.auditPassDrawerNote,
            repayDate: waterLineFlag ? (new Date(_this.repayDate).format('yyyy-MM-dd')) : null,
            serialNo: waterLineFlag ? _this.serialNo : null,
            repaymentAccount: waterLineFlag ? _this.repaymentAccount : null
          }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            // _this.accessModal = false
            // _this.changeCostList = []
            // _this.changeInvoiceList = []
            // if (Object.keys(_this.newWin).length > 0) {
            //   _this.newWin.close()
            // }

            this.$Message.success('操作成功');
            this.auditPassDrawer = false;
            this.returnZ();
            // this.$router.push({ name: 'myTasks' })
            // this.$router.push({name: 'financeAuditing'})
          } else {
            _this.auditPassLoading = false;
            _this.$Message.info(res.data.msg);
            return false;
          }
        })
        .catch(err => {
          _this.auditPassLoading = false;
          _this.$Message.warning(err.response.data.msg);
        });
    },
    cancelAuditPass () {
      const _this = this;
      _this.auditPassDrawer = false;
    },
    // 改变退回节点
    changeRejectPeople (_type) {
      if (_type === 1) {
        this.rejectDate.reason = '';
      }
      this.rejectDate.sendBackResult = '';
    },
    // 审核退回
    reject () {
      const _this = this;
      _this.$http({ // 查看提交人是否离职
        method: 'get',
        url: API.financeModule.getEmpStatus,
        params: {
          receiptNo: _this.basicMassege.receiptNo
        }
      })
        .then(res => {
          if (res.data.code === '100200') {
            // empStatus: 0 - 在职 | 1 - 离职
            this.empStatus = res.data.data && Number(res.data.data.empStatus);
          } else {
            _this.$Message.info(res.data.msg);
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        }).finally(() => {
          _this.rejectDrawer = true; // 接口返回结果后打开弹窗
        });
    },
    // 退回之前的查询
    beforeReject () {
      const _this = this;
      _this.rejectLoading = true;
      if (_this.rejectDate.rejectPeople === '') {
        _this.$Message.info('请填写退回节点');
        _this.rejectLoading = false;
        return false;
      }
      if (_this.rejectDate.sendBackResult === '') {
        _this.$Message.info('请填写处理结果');
        _this.rejectLoading = false;
        return false;
      }
      if ([ '0', '2', '4' ].indexOf(_this.rejectDate.rejectPeople) !== -1 && !_this.rejectDate.reason) {
        _this.$Message.info('请填写退回原因');
        _this.rejectLoading = false;
        return false;
      }
      if (_this.rejectDate.rejectPeople === '0') { // 退回提交人 =》
        _this.$http({
          method: 'get',
          url: API.financeModule.isExistEnableProblemFiled,
          params: {
            receiptNo: _this.basicMassege.receiptNo
          }
        })
        .then(res => { // =》 是否存在未失效问题标签
          if (res.data.code === '100200') {
            if (res.data.data) { // =》 存在 =》 弹窗确认是否驳回
              _this.$Modal.confirm({
                title: this.$t('message.title'),
                content: '<p>存在未失效问题标签，请确认是否驳回</p>',
                onOk: () => {
                  const time = 400;
                  setTimeout(() => { // 确认跳过 =》判断是否跳过审批
                    // _this.rejectDrawerOk()
                    _this.checkShowMsg();
                  }, time);
                },
                onCancel: () => {
                  _this.rejectLoading = false;
                }
              });
            } else { // 不存在 =》判断是否跳过审批
              // _this.rejectDrawerOk()
              _this.checkShowMsg();
            }
          } else {
            _this.$Message.info(res.data.msg);
            _this.rejectLoading = false;
            return false;
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
      } else { // 退回其他两个
        _this.rejectSubmit();
      }
    },
    rejectDrawerOk () {
      const _this = this;
      // =》 退回 =》 退回负责人 =》 整单驳回
      if (_this.rejectDate.rejectPeople === '0' && _this.rejectDate.sendBackResult === '整单驳回') {
        this.isElectronicsInvoice(); // 整单驳回 =》 判断是否存在纸质发票
      } else {
        _this.rejectSubmit();
        // _this.checkShowMsg()
      }
    },
    // 判断此单据是否全部是电子发票
    isElectronicsInvoice () {
      const _this = this;
      const obj = { receiptNo: _this.formInfoFormRoute.docId };
      return this.$http({
        method: 'get',
        url: API.financeModule.isElectronicsInvoice,
        params: obj
      }).then(res => {
        if (res.data.code === '100400') { // =》 异常
          _this.$Message.warning(res.data.msg); // =》 异常提醒
          this.rejectLoading = false;
        } else {
          if (res.data.isElectronicsFlag === '0') { // =》 存在纸质发票
            _this.editReferralModel = true; // =》 弹出领取方式
            _this.getReferraltypeList();
          } else { // =》 不存在纸质发票
            _this.rejectSubmit(); // 直接调用退回接口
          }
        }
      }).catch(err => {
        _this.$Message.warning(err.response.data.msg);
        this.rejectLoading = false;
      });
    },
    // 获取纸质转交方式列表
    getReferraltypeList () {
      const _this = this;
      _this
        .$http({
          method: 'get',
          url: API.financeModule.getReferraltypeList,
          params: {
            receiptType: _this.basicMassege.receiptType,
            type: 0
          }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            this.referraltypeList = res.data.data || [];
          } else {
            _this.$Message.info(res.data.msg);
            return false;
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
        });
    },
     // 关闭退回方式弹窗
    closeEditReferralModel () {
      this.editReferralModel = false;
      this.paperLoading = false;
      this.rejectLoading = false;
      this.referralNotice = {
        receiptNo: '',
        receiveAddress: '',
        receiveMobile: '',
        receiveName: '',
        referralType: ''
      };
    },
    // 保存修改的
    saveReferral () {
      const _this = this;
      if (!_this.referralNotice.referralType) {
        _this.$Message.info('请将填写的信息补充完整');
        return false;
      }
      if (_this.referralNotice.referralType === '快递寄回') {
        if (!_this.referralNotice.receiveName || !_this.referralNotice.receiveMobile || !_this.referralNotice.receiveAddress) {
          _this.$Message.info('请将填写的信息补充完整');
          return false;
        }
      }
      this.paperLoading = true;
      // _this.checkShowMsg()
      _this.rejectSubmit();
    },
    // 获取是否进行退回的弹窗展示
    checkShowMsg () {
      const _this = this;
      _this
        .$http({
          method: 'get',
          url: API.financeModule.isSkipExamine,
          params: {
            receiptNo: _this.formInfoFormRoute.docId
          }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            _this.rejectDate.isSkipExamine = res.data.data.isSkipExamine;
            // 当前问题标签均可跳过业务审批节点，是否确认？1 提示 2 不提示
            if (_this.rejectDate.isSkipExamine === '2') { // 不提示 =》 判断是否整单驳回
              // _this.rejectSubmit()
              _this.rejectDrawerOk();
            } else {
              _this.$Modal.confirm({
                title: '提示',
                content: '<p>当前问题标签均可跳过业务审批节点，是否确认？</p>',
                onOk: () => {
                  const time = 400;
                  setTimeout(() => { // 提示确认 =》 判断是否整单驳回
                    // _this.rejectSubmit()
                    _this.rejectDrawerOk();
                  }, time);
                },
                onCancel: () => {
                  _this.$Message.info('操作已取消');
                  this.rejectLoading = false;
                }
              });
            }
          } else {
            this.rejectLoading = false;
            this.paperLoading = false;
            _this.$Message.info(res.data.msg);
            return false;
          }
        })
        .catch(err => {
          this.rejectLoading = false;
          this.paperLoading = false;
          _this.$Message.warning(err.response.data.msg);
        });
    },
    // 退回接口
    rejectSubmit () {
      const _this = this;

      _this.referralNotice.receiptNo = _this.formInfoFormRoute.docId;

      _this
        .$http({
          method: 'post',
          url: API.financeModule.sendBack,
          data: {
            receiptNo: _this.formInfoFormRoute.docId,
            sendBackNode: _this.rejectDate.rejectPeople, // 退回节点
            sendBackResult: _this.rejectDate.sendBackResult, // 处理结果
            actionMessage: _this.rejectDate.reason,
            intelligent: _this.rejectDate.intelligentReturn || false,
            isSkipExamine: _this.rejectDate.isSkipExamine,
            referralNoticeDTO: { ..._this.referralNotice }
          }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            // if (Object.keys(_this.newWin).length > 0) {
            //   _this.newWin.close()
            // }
            this.$Message.success('操作成功');
            // this.$router.go(-1)
            this.returnZ();
            // this.$router.push({name: 'financeAuditing'})
          } else {
            this.rejectLoading = false;
            this.paperLoading = false;
            _this.$Message.info(res.data.msg);
            return false;
          }
        })
        .catch(err => {
          this.rejectLoading = false;
          this.paperLoading = false;
          _this.$Message.warning(err.response.data.msg);
        });
    },
    cancelReject () {
      const _this = this;
      _this.rejectDrawer = false;
    },
    // 加签
    additionalSignature () {
      const _this = this;
      _this.additionalSignatureDrawer = true;
    },

    // 查询人员
    queryByName (_val) {
      const _this = this;
      _this.cancel && _this.cancel();
      _this.loading1 = true;
      if (_val !== '') {
        _this
          .$http({
            method: 'get',
            url: API.financeModule.queryByName,
            params: {
              name: _val || null
            },
            cancelToken: new CancelToken(function executor (c) {
              _this.cancel = c;
              // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
            })
          })
          .then(res => {
            _this.loading1 = false;
            if (res.data.data) {
              _this.addSignOptions = res.data.data;
              // _this.$forceUpdate()
            } else {
              _this.addSignOptions = [];
              _this.$Message.info(res.data.msg);
              return false;
            }
          })
          .catch(err => {
            if (!err.__CANCEL__) {
              _this.loading1 = false;
              _this.$Message.warning(err.response.data.msg);
            }
          });
      } else {
        _this.loading1 = false;
        _this.addSignOptions = [];
      }
    },
    // 改变搜索名
    changeHandoverPerson (_val) {
      if (_val) {
        if (this.additionalSignatureData.handoverPersons.length) {
          let isChoose = false;
          this.additionalSignatureData.handoverPersons.map(_ite => {
            if (_ite.value === _val.value) {
              isChoose = true;
            }
          });
          if (!isChoose) {
            this.additionalSignatureData.handoverPersons.push(_val);
          }
        } else {
          this.additionalSignatureData.handoverPersons.push(_val);
        }
        const _this = this;
        setTimeout(function () {
          _this.additionalSignatureData.handoverPerson = '';
        });

        this.$forceUpdate();
      }
    },
    // 删除标签
    delSign (_ind) {
      this.additionalSignatureData.handoverPersons.splice(_ind, 1);
    },
    // 加签窗口确定
    additionalSignatureOk () {
      const _this = this;

      if (_this.additionalSignatureData.handoverPersons.length === 0) {
        _this.$Message.info('请选择加签人');
        return false;
      }
      if (!_this.additionalSignatureData.note) {
        _this.$Message.info('请填写加签备注');
        return false;
      }
      const _pers = [];
      _this.additionalSignatureData.handoverPersons.map(_ite => {
        _pers.push(_ite.value);
      });
      _this.signLoading = true;
      _this
        .$http({
          method: 'post',
          url: API.financeModule.addApprover,
          data: {
            receiptNo: _this.formInfoFormRoute.docId,
            addApproverPerson: _pers, // 被加签人工号
            addApproverRemark: _this.additionalSignatureData.note || null, // 加签备注
            addApproverBack: _this.additionalSignatureData.addApproverBack // 加签完成是否通知
          }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            // _this.accessModal = false
            // _this.changeCostList = []
            // _this.changeInvoiceList = []
            // if (Object.keys(_this.newWin).length > 0) {
            //   _this.newWin.close()
            // }
            this.$Message.success('操作成功');
            // this.$router.go(-1)
            this.returnZ();

            // this.$router.push({name: 'financeAuditing'})
          } else {
            _this.signLoading = false;
            _this.$Message.info(res.data.msg);
            return false;
          }
        })
        .catch(err => {
          _this.signLoading = false;
          _this.$Message.warning(err.response.data.msg);
        });
    },
    cancelAdditionalSignature () {
      const _this = this;
      _this.additionalSignatureDrawer = false;
    },
    // 打印
    printing () {
      window.open(
        API.financeModule.printReceiptInfo +
          '?receiptNo=' +
          this.formInfoFormRoute.docId
      );
    },
    returnZ () {
      if (Object.keys(this.newWin).length > 0) {
        this.newWin.close();
      }
      const time = 2000;
      setTimeout(function () {
        window.close();
      }, time);
    },
    clearSearchForm () {
      this.formValidate = {
        checkStatus: '', // 单据编号
        imgRandomCode: '' // 提交人
      };
    },
    /**
     *
     * 添加意见（整单/费用行）
     * _type  fee 费用行  all 整单
     * feeObj 费用对象
     *
     * */
    addOnion (_type, feeObj) {
      const _this = this;

      if (
        Object.keys(_this.newWin).length === 0 ||
        (Object.keys(_this.newWin).length >= 0 && _this.newWin.closed)
      ) {
        let testPage =
          '/financeModule/docsTransfer/financeOrderScanBrowser/' +
          JSON.stringify({
            receiptNo: _this.basicMassege.receiptNo,
            receiptId: '',
            type: 'col',
            pageType: 'verify'
          });
        _this.newWin = window.open(`${testPage}`);
        const time = 3000;
        setTimeout(function () {
          _this.newWin.addOnion(_type, feeObj);
        }, time);
      } else {
        _this.newWin.addOnion(_type, feeObj);
      }
    },
    /**
     * @description 图片加载中
    */
    handleImgLoad (e, img) {
      img.height = e.currentTarget.offsetHeight;
      img.loading = false;
    },
    /**
     * @description 图片加载失败
    */
    handleImgError (e, img) {
      img.loading = false;
      e.target.alt = '加载失败';
    },
    handleMouseDown (e, img) {
      if (img.loading || e.button !== 0) {
        return;
      }
      const { offsetX, offsetY } = img.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle(ev => {
        img.transform.offsetX = offsetX + ev.pageX - startX;
        img.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, 'mousemove', this._dragHandler);
      on(document, 'mouseup', () => {
        off(document, 'mousemove', this._dragHandler);
      });
      e.preventDefault();
    },
    /**
     * @description 对图片展示进行操作
     * @param {String} clocelise  旋转
     * @param {String} zoomIn  放大
     * @param {String} zoomOut  缩小
    */
    handleActions (action, img, options = {}) {
      const zoomRateNum = 0.2;
      const rotateDegNum = 90;
      // 放大倍数及旋转度数基准
      const { zoomRate, rotateDeg, enableTransition } = {
        enableTransition: true,
        zoomRate: zoomRateNum,
        rotateDeg: rotateDegNum,
        ...options
      };

      // 获取当前图片样式
      const { transform } = img;
      const fixedNum = 3;

      // 对图片样式以基准放大缩小旋转
      switch (action) {
        case 'zoomOut':
          if (transform.scale > zoomRateNum) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(fixedNum));
          }
          break;
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(fixedNum));
          break;
        case 'clocelise':
          transform.rotation += rotateDeg;
          break;
        default:
          break;
      }
      transform.enableTransition = enableTransition;
    },
    /**
     *
     * 展示费用附件(图片)
    */
    showImgModal (_imgs) {
      //  初始化地址及样式
      if (_imgs && _imgs.length > 0) {
        this.feeImgs = _imgs.map(item => {
          const type = item && item.split('.').pop().toLowerCase();
          const scaleDegs = 1.5;
          const pdfHeight = 560;
          const imgHeight = 200;
          return {
            type,
            src: item, // 图片地址
            transform: { // 默认图片样式
              scale: type === 'pdf' ? 1 : scaleDegs,
              rotation: 0,
              offsetX: 0,
              offsetY: 0,
              enableTransition: false
            },
            height: type === 'pdf' ? pdfHeight : imgHeight // 默认图片高度
          };
        });
        this.imgsModal = true;
      }
    },
    closeImgModal () {
      this.feeImgs = [];
      this.imgsModal = false;
    },
    /**
     *
     * 财务标记处理
    */
    changeFeeFlag (feeObj, callBack) {
      const _this = this;
      _this
        .$http({
          method: 'get',
          url: API.financeModule.receiptFeeFlag,
          params: {
            feeId: feeObj.feeId,
            sign: feeObj.isSign
          }
        })
        .then(res => {
          if (res.data && res.data.code === '100200') {
            callBack(true, feeObj.isSign);
          } else {
            _this.$Message.info(res.data.msg);
            callBack(false, feeObj.isSign);
          }
        })
        .catch(err => {
          _this.$Message.warning(err.response.data.msg);
          callBack(false, feeObj.isSign);
        });
    },
    /**
     *
     * 跳转到暂存待办页面
    */
    goTemporaryStoragePage () {
      this.$router.push({
        name: 'temporaryStorage',
        params: {
          data: JSON.stringify({
            receiptNo: this.formInfoFormRoute.docId,
            isRead: this.isRead
          })
        }
      });
    },
    // 获取税率列表
    getAllTaxRate () {
      const _this = this;
      _this.$http({
        method: 'get',
        url: API.financeModule.getEnableTaxRate
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.taxRates = res.data.data;
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    goDCpage () {
      const url = 'dchat://im/start_conversation?name=' + this.basicMassege.submitPersonLdap;
      window.open(url, '_blank');
    },
    // 展示关联发票弹窗
    showRelationModal () {
      this.showRelationInvoiceTable = false;
      this.checkRelationInvoice();
    },
    // 关闭关联发票弹窗
    closeRelationModal () {
      this.relationModal = false;
      this.relationInvoices = [];
      this.relationInvoiceForm = {
        invoiceCode: '',
        invoiceNumber: ''
      };
      this.relationInvoiceLoading = false;
      this.showRelationInvoiceTable = false;
    },
    // 校验是否可以关联发票
    checkRelationInvoice () {
      const _this = this;
      _this.$http({
        method: 'get',
        url: API.financeModule.invoiceOccupyCheckAmount,
        params: {
          receiptNo: _this.basicMassege.receiptNo
        }
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          _this.relationModal = true;
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 查询关联发票
    queryRelationInvoice () {
      const _this = this;
      _this.relationInvoiceLoading = true;
      _this.$http({
        method: 'get',
        url: API.financeModule.invoiceOccupyGetInvoiceOccupyVO,
        params: {
          receiptNo: _this.basicMassege.receiptNo
        }
      })
      .then(res => {
        _this.relationInvoiceLoading = false;
        if (res.data && res.data.code === '100200') {
          _this.showRelationInvoiceTable = true;
          _this.relationInvoices = res.data.data || [];
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.relationInvoiceLoading = false;
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 关联发票
    realRelationInvoice () {
      const _this = this;
      if (!_this.relationInvoiceForm.invoiceCode || !_this.relationInvoiceForm.invoiceNumber) {
        _this.$Message.info('请将要关联的发票信息补充完整');
        return false;
      }
      _this.relationInvoiceLoading = true;
      _this.$http({
        method: 'post',
        url: API.financeModule.invoiceOccupy,
        data: {
          receiptNo: _this.basicMassege.receiptNo,
          invoiceCode: _this.relationInvoiceForm.invoiceCode,
          invoiceNumber: _this.relationInvoiceForm.invoiceNumber
        }

      })
      .then(res => {
        _this.relationInvoiceLoading = false;
        if (res.data && res.data.code === '100200') {
          _this.$Message.info(res.data.data);
          _this.relationInvoiceForm = {
            invoiceCode: '',
            invoiceNumber: ''
          };
          _this.queryRelationInvoice();
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 删除已关联发票
    delRelationInvoice (_row) {
      const _this = this;
      _this.$http({
        method: 'delete',
        url: API.financeModule.invoiceOccupy + '/' + _row.invoiceOccupyId
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          _this.$Message.info(res.data.data);
          _this.queryRelationInvoice();
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 展示修改转出额按钮 （只有一张专票且存在差额转出和命中转出）
    getShowTransAmountButton () {
      const _this = this;
      _this.$http({
        method: 'get',
        url: API.financeModule.showRollOutButton,
        params: {
          receiptNo: _this.formInfoFormRoute.docId
        }
      }).then(res => {
        if (res.data.code === '100200') {
          _this.showTransAmountButtonFlag = res.data.data;
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 转出填充
    realTrans () {
      const _this = this;
      _this.transLoading = true;
      _this.$http({
        method: 'put',
        url: API.financeModule.rollOutCalc + _this.formInfoFormRoute.docId,
        params: {}
      }).then(res => {
        _this.transLoading = false;
        if (res.data.code === '100200') {
          _this.getInvoiceInformationDate();
        }
        _this.$Message.info(res.data.msg);
      })
      .catch(err => {
        _this.transLoading = false;
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 税额核减处理
    editRowRateAmount (_row) {
      _row.taxRateReal = 0;
      _row.noneTaxAmountReal += _row.taxAmount;
      _row.taxAmount = 0;
      _row.totalAmount = _row.noneTaxAmountReal + _row.taxAmount;
      this.saveColByRateAmount(_row);
    },
    // 税额核减保存接口
    saveColByRateAmount (_row) {
      let obj = {
        'receiptNo': this.formInfoFormRoute.docId,
        'feeId': _row.feeId,
        'noneTaxAmountReal': _row.noneTaxAmountReal,
        'taxRateReal': _row.taxRateReal,
        'nonInvoiceAmount': _row.nonInvoiceAmount,
        'taxAmount': _row.taxAmount,
        'remarkAmount': _row.remarkAmount || 0,
        'remark': _row.remark
      };
      return this.$http({
        method: 'put',
        url: API.financeModule.upadteReceiptFee,
        data: obj
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          this.$Message.info('操作成功');
          this.getReceiptInfo('row');
        } else {
          this.$Message.info(res.data.msg);
        }
      });
    },
    // 打开共用影像弹窗
    showCommonImgModal () {
      this.commonImgModal = true;
      this.commonImgForm = {
        randomCode: ''
      };
      this.queryRelationImgs();
    },
    // 查询已关联的影像
    queryRelationImgs () {
      const _this = this;
      _this.commonImgLoading = true;
      _this.$http({
        method: 'get',
        url: API.financeModule.getImageOccupy,
        params: {
          receiptNo: _this.basicMassege.receiptNo
        }
      })
      .then(res => {
        _this.commonImgLoading = false;
        if (res.data && res.data.code === '100200') {
          _this.commonImgs = res.data.data || [];
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 关联影像
    conformRelationImg () {
      const _this = this;
      if (!_this.commonImgForm.randomCode) {
        _this.$Message.info('请填写将要关联的影像编号');
        return false;
      }
      _this.commonImgLoading = true;
      _this.$http({
        method: 'post',
        url: API.financeModule.occupyImage,
        data: {
          receiptNo: _this.basicMassege.receiptNo,
          randomCode: _this.commonImgForm.randomCode
        }
      })
      .then(res => {
        _this.commonImgLoading = false;
        if (res.data && res.data.code === '100200') {
          _this.$Message.info(res.data.data);
          _this.commonImgForm = {
            randomCode: ''
          };
          _this.queryRelationImgs();
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.commonImgLoading = false;
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 删除已关联的影像
    delRelationImg (_row) {
      const _this = this;
      _this.$http({
        method: 'delete',
        url: API.financeModule.invoiceOccupy + '/' + _row.invoiceOccupyId
      })
      .then(res => {
        if (res.data && res.data.code === '100200') {
          _this.$Message.info(res.data.data);
          _this.queryRelationImgs();
        } else {
          _this.$Message.info(res.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.warning(err.response.data.msg);
      });
    },
    // 关闭共用影像弹窗
    closeCommonImgModal () {
      this.commonImgModal = false;
    }

  }
};
</script>
<style scoped lang='less'>
.linecheck {
  margin-top: 20px;
}
.expenses {
  font-size: 15px;
}
.months {
  display: flex;
}
.ivu-form-item-content > .ivu-date-picker {
  width: 100%;
}
.breadcrumb-title {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 500;
}
.page_sty {
  margin-top: 20px;
  text-align: right;
}
.mt20 {
  margin-top: 20px;
}
.el-pointer {
  cursor: pointer;
}
.radioContant {
  line-height: 35px;
  text-align: center;
}
.tcolor-blue {
  color: #2c8cf0;
}
.tcolor-orange {
  color: #fc9153;
}
// .demo-drawer-footer {
//   width: 100%;
//   position: relative;
//   bottom: 0;
//   left: 0;
//   border-top: 1px solid #e8e8e8;
//   padding: 10px 16px;
//   text-align: right;
//   background: #fff;
// }
.goDchat {
  display: inline-block;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  user-select: none;
  padding: 5px 15px 6px;
  font-size: 12px;
  border-radius: 4px;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear;
  color: #fff;
  background-color: #fc9153;
  border-color: #fc9153;
}
.grayBtn{color: #D9D9D9; border: 1px solid #D9D9D9;}
.colorfc9153{color: #fc9153}
.label{display: inline-block; width: 98px; text-align: right; color: #666666;}
.ivu-col>p{line-height: 30px;}
.drawer-footer{
  width: 40%;
  position: fixed;
  bottom: 0;
  right: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.suspensionBtn{
  width: 100%;
  height: 69px;
  line-height: 69px;
  // padding-bottom: 22px;
  // position:fixed;
  background-color: #fff;
  // top: 114px;
  z-index: 100
}
</style>
<style>
.tab-items {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
}
.rowoptions {
  height: 32px;
  line-height: 32px;
}
.disabdel {
  pointer-events: none;
}
.disabdel:hover {
  cursor: no-drop;
  color: red;
}
/* 多选标签处理 */
/* .financeCountEnd-container .ivu-select-multiple > .ivu-select-selection > div{
    display: inline-flex;
    overflow: hidden;
  } */
.largecontent > .ivu-form-item-content {
  margin-left: 100px !important;
}
.ivu-table .demo-table-info-row td {
  background-color: #fff7f1 !important;
  /*color: #fff;*/
}
.showLine {
  margin: 20px 0;
  border-top: 2px solid #e8e8e8;
}
.tlright {
  text-align: right;
}
.table-save-text-btn {
    pointer-events: none;
}
.table-save-text-btn::before {
    display: inline-block;
    content: "\F45B";
    font-family: Ionicons;
    margin-right: 2px;
    pointer-events: none;
    animation: ani-load-loop 1s linear infinite;
    margin-bottom: 0;
    margin-right: 2px;
}
.ivu-switch-disabled.ivu-switch-checked {
    border-color: #87D068!important;
    background-color: #87D068!important;
    opacity: .8;
}
.btn_img{
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
}
.btn_img:hover{
  border-color: #ddd
}
.img_container {
  overflow: hidden;
  position: relative;
  margin: 30px 0;
  padding: 0 15px;
  box-sizing: border-box;
}
.demo-badge-alone{
  background: yellow !important;
  color: black !important;
}
</style>

