import { ChatScenario } from '../types/chatbot';

export const defaultChatScenario: ChatScenario = {
  id: 'ecommerce-cs',
  name: 'E-commerce Customer Service',
  startNodeId: 'welcome',
  language: 'ko',
  nodes: {
    welcome: {
      id: 'welcome',
      type: 'message',
      content: '안녕하세요! 고객센터 챗봇입니다. 무엇을 도와드릴까요?',
      options: [
        {
          id: 'order-inquiry',
          label: '📦 주문 조회',
          value: 'order',
          action: 'navigate',
          nextNodeId: 'order-menu'
        },
        {
          id: 'delivery-inquiry',
          label: '🚚 배송 문의',
          value: 'delivery',
          action: 'navigate',
          nextNodeId: 'delivery-menu'
        },
        {
          id: 'return-exchange',
          label: '🔄 교환/환불',
          value: 'return',
          action: 'navigate',
          nextNodeId: 'return-menu'
        },
        {
          id: 'general-inquiry',
          label: '💬 기타 문의',
          value: 'general',
          action: 'navigate',
          nextNodeId: 'general-menu'
        }
      ]
    },
    'order-menu': {
      id: 'order-menu',
      type: 'message',
      content: '주문 관련 문의를 선택해주세요.',
      options: [
        {
          id: 'order-status',
          label: '주문 상태 확인',
          value: 'status',
          action: 'navigate',
          nextNodeId: 'order-number-input'
        },
        {
          id: 'order-cancel',
          label: '주문 취소',
          value: 'cancel',
          action: 'navigate',
          nextNodeId: 'order-cancel-info'
        },
        {
          id: 'order-change',
          label: '주문 변경',
          value: 'change',
          action: 'navigate',
          nextNodeId: 'order-change-info'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'order-number-input': {
      id: 'order-number-input',
      type: 'input',
      content: '주문번호를 입력해주세요. (예: ORD20241201001)',
      nextNodeId: 'order-status-webhook'
    },
    'order-status-webhook': {
      id: 'order-status-webhook',
      type: 'webhook',
      content: '주문 정보를 조회 중입니다...',
      webhookUrl: '/api/webhook/order-status',
      nextNodeId: 'order-status-result'
    },
    'order-status-result': {
      id: 'order-status-result',
      type: 'message',
      content: `📋 주문 정보 조회 결과

🔸 주문번호: {{orderNumber}}
🔸 주문상태: {{status}}
🔸 배송예정일: {{deliveryDate}}
🔸 운송장번호: {{trackingNumber}}

추가 문의사항이 있으시면 고객센터(1588-0000)로 연락해주세요.`,
      options: [
        {
          id: 'order-more',
          label: '다른 주문 조회',
          value: 'more',
          action: 'navigate',
          nextNodeId: 'order-number-input'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'order-cancel-info': {
      id: 'order-cancel-info',
      type: 'message',
      content: `📋 주문 취소 안내

🔸 취소 가능 시간: 결제 완료 후 1시간 이내
🔸 배송 준비 중인 상품은 취소 불가
🔸 취소 수수료: 무료 (단, 부분 취소 시 배송비 차감 가능)

주문 취소를 원하시면 마이페이지 > 주문내역에서 직접 취소하거나 고객센터로 연락해주세요.`,
      options: [
        {
          id: 'back-to-order',
          label: '← 주문 메뉴로',
          value: 'order',
          action: 'navigate',
          nextNodeId: 'order-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'order-change-info': {
      id: 'order-change-info',
      type: 'message',
      content: `📋 주문 변경 안내

🔸 변경 가능 항목: 배송지, 연락처
🔸 변경 불가 항목: 상품, 수량, 결제수단
🔸 변경 가능 시간: 배송 시작 전까지

주문 변경을 원하시면 고객센터(1588-0000)로 연락해주세요.`,
      options: [
        {
          id: 'back-to-order',
          label: '← 주문 메뉴로',
          value: 'order',
          action: 'navigate',
          nextNodeId: 'order-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'delivery-menu': {
      id: 'delivery-menu',
      type: 'message',
      content: '배송 관련 문의를 선택해주세요.',
      options: [
        {
          id: 'delivery-tracking',
          label: '배송 추적',
          value: 'tracking',
          action: 'navigate',
          nextNodeId: 'order-number-input'
        },
        {
          id: 'delivery-change',
          label: '배송지 변경',
          value: 'change',
          action: 'navigate',
          nextNodeId: 'delivery-change-info'
        },
        {
          id: 'delivery-delay',
          label: '배송 지연 문의',
          value: 'delay',
          action: 'navigate',
          nextNodeId: 'delivery-delay-info'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'delivery-change-info': {
      id: 'delivery-change-info',
      type: 'message',
      content: `📋 배송지 변경 안내

🔸 변경 가능 시간: 배송 시작 전까지
🔸 변경 방법: 마이페이지 > 주문내역 > 배송지 변경
🔸 추가 배송비: 지역에 따라 차등 적용

배송지 변경이 어려우시면 고객센터(1588-0000)로 연락해주세요.`,
      options: [
        {
          id: 'back-to-delivery',
          label: '← 배송 메뉴로',
          value: 'delivery',
          action: 'navigate',
          nextNodeId: 'delivery-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'delivery-delay-info': {
      id: 'delivery-delay-info',
      type: 'message',
      content: `📋 배송 지연 안내

배송이 지연되는 경우:
🔸 천재지변 (태풍, 폭설 등)
🔸 물량 집중 (명절, 세일 기간)
🔸 배송지 접근 불가

지연 보상:
🔸 3일 이상 지연 시 배송비 환불
🔸 7일 이상 지연 시 추가 적립금 지급

자세한 문의는 고객센터(1588-0000)로 연락해주세요.`,
      options: [
        {
          id: 'back-to-delivery',
          label: '← 배송 메뉴로',
          value: 'delivery',
          action: 'navigate',
          nextNodeId: 'delivery-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'return-menu': {
      id: 'return-menu',
      type: 'message',
      content: '교환/환불 관련 문의를 선택해주세요.',
      options: [
        {
          id: 'return-policy',
          label: '교환/환불 정책',
          value: 'policy',
          action: 'navigate',
          nextNodeId: 'return-policy-info'
        },
        {
          id: 'return-request',
          label: '교환/환불 신청',
          value: 'request',
          action: 'navigate',
          nextNodeId: 'return-request-form'
        },
        {
          id: 'return-status',
          label: '교환/환불 진행 상황',
          value: 'status',
          action: 'navigate',
          nextNodeId: 'order-number-input'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'return-policy-info': {
      id: 'return-policy-info',
      type: 'message',
      content: `📋 교환/환불 정책 안내

🔸 교환/환불 가능 기간: 상품 수령일로부터 7일 이내
🔸 교환/환불 불가 상품: 
   - 개봉한 식품, 화장품
   - 개인 맞춤 제작 상품
   - 시간 경과로 가치가 현저히 감소한 상품

🔸 반품 배송비: 
   - 고객 변심: 3,000원 고객 부담
   - 상품 불량: 무료

🔸 환불 처리 기간: 접수 후 3-5 영업일

더 자세한 내용은 고객센터(1588-0000)로 문의해주세요.`,
      options: [
        {
          id: 'return-request',
          label: '교환/환불 신청하기',
          value: 'request',
          action: 'navigate',
          nextNodeId: 'return-request-form'
        },
        {
          id: 'back-to-return',
          label: '← 교환/환불 메뉴로',
          value: 'return',
          action: 'navigate',
          nextNodeId: 'return-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'return-request-form': {
      id: 'return-request-form',
      type: 'message',
      content: `📋 교환/환불 신청 방법

온라인 신청:
🔸 마이페이지 > 주문내역 > 교환/환불 신청
🔸 신청 사유 및 상세 내용 입력
🔸 상품 사진 첨부 (불량품의 경우)

전화 신청:
🔸 고객센터: 1588-0000
🔸 운영시간: 평일 09:00-18:00

신청 후 처리 절차:
1. 신청 접수 (즉시)
2. 상품 회수 (1-2일)
3. 검수 진행 (1-2일)
4. 교환/환불 완료 (1-2일)`,
      options: [
        {
          id: 'back-to-return',
          label: '← 교환/환불 메뉴로',
          value: 'return',
          action: 'navigate',
          nextNodeId: 'return-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'general-menu': {
      id: 'general-menu',
      type: 'message',
      content: '기타 문의사항을 선택해주세요.',
      options: [
        {
          id: 'contact-info',
          label: '📞 고객센터 연결',
          value: 'contact',
          action: 'navigate',
          nextNodeId: 'contact-info'
        },
        {
          id: 'faq',
          label: '❓ 자주 묻는 질문',
          value: 'faq',
          action: 'navigate',
          nextNodeId: 'faq-info'
        },
        {
          id: 'live-chat',
          label: '💬 실시간 상담',
          value: 'live',
          action: 'navigate',
          nextNodeId: 'live-chat-info'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'contact-info': {
      id: 'contact-info',
      type: 'message',
      content: `📞 고객센터 안내

🔸 전화번호: 1588-0000
🔸 운영시간: 평일 09:00-18:00 (주말/공휴일 휴무)
🔸 이메일: cs@example.com
🔸 평균 대기시간: 3-5분

📱 카카오톡 상담:
🔸 카카오톡에서 '이커머스' 검색
🔸 24시간 자동응답 서비스

긴급한 문의사항은 전화 상담을 이용해주세요.`,
      options: [
        {
          id: 'back-to-general',
          label: '← 기타 문의로',
          value: 'general',
          action: 'navigate',
          nextNodeId: 'general-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'faq-info': {
      id: 'faq-info',
      type: 'message',
      content: `❓ 자주 묻는 질문

Q1. 배송비는 얼마인가요?
A1. 3만원 이상 구매 시 무료배송, 미만 시 3,000원

Q2. 당일배송이 가능한가요?
A2. 오후 2시 이전 주문 시 서울/경기 지역 당일배송 가능

Q3. 적립금은 언제 지급되나요?
A3. 구매확정 후 3일 이내 자동 지급

Q4. 회원가입 혜택이 있나요?
A4. 신규가입 시 10% 할인쿠폰 + 2,000원 적립금

더 많은 FAQ는 홈페이지 하단 '고객센터'에서 확인하세요.`,
      options: [
        {
          id: 'back-to-general',
          label: '← 기타 문의로',
          value: 'general',
          action: 'navigate',
          nextNodeId: 'general-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    },
    'live-chat-info': {
      id: 'live-chat-info',
      type: 'message',
      content: `💬 실시간 상담 안내

현재 실시간 상담 서비스는 준비 중입니다.

대신 이용 가능한 상담 방법:
🔸 전화상담: 1588-0000 (평일 09:00-18:00)
🔸 이메일: cs@example.com (24시간 접수)
🔸 카카오톡: '이커머스' 검색 후 친구추가

빠른 답변이 필요하시면 전화상담을 이용해주세요.`,
      options: [
        {
          id: 'contact-info',
          label: '📞 고객센터 정보 보기',
          value: 'contact',
          action: 'navigate',
          nextNodeId: 'contact-info'
        },
        {
          id: 'back-to-general',
          label: '← 기타 문의로',
          value: 'general',
          action: 'navigate',
          nextNodeId: 'general-menu'
        },
        {
          id: 'back-to-main',
          label: '← 처음으로',
          value: 'main',
          action: 'navigate',
          nextNodeId: 'welcome'
        }
      ]
    }
  }
};