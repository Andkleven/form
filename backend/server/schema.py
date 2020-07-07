import graphene
import graphql_jwt
from backend.app.models import UserProfile
from backend.app import schema
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ('__all__')


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=UserProfile.objects.get(user=info.context.user))


class Query(schema.Query, graphene.ObjectType):
    pass


class Mutation(schema.Mutation, graphene.ObjectType):
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, types=[])
